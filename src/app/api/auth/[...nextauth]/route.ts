import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user already exists
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!dbUser) {
            // Auto-create user for Google login
            dbUser = await prisma.user.create({
              data: {
                name: user.name || 'Google User',
                email: user.email,
                role: 'PARENT',
                phone: '',
              },
            });
          }
          return true;
        } catch (err) {
          console.error('[NEXTAUTH_GOOGLE_SIGNIN_ERROR]:', err);
          return true; // Still allow sign in
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { tutorProfile: true },
          });
          if (dbUser) {
            (session.user as any).id = dbUser.id;
            (session.user as any).role = dbUser.role;
            (session.user as any).phone = dbUser.phone;
            (session.user as any).hasTutorProfile = Boolean(dbUser.tutorProfile);
          }
        } catch (err) {
          console.error('[NEXTAUTH_SESSION_ERROR]:', err);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/parent/login',
    error: '/parent/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'tuitionforhome_super_secret_jwt_key_2026',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
