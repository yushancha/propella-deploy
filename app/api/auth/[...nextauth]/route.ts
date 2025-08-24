import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// 仅在设置了 DATABASE_URL 时才创建 Prisma 客户端
const hasDatabase = !!process.env.DATABASE_URL;
const prisma = hasDatabase ? new PrismaClient() : (null as unknown as PrismaClient);

// 添加调试日志
console.log("NextAuth 配置初始化...");
console.log("环境变量检查:");
console.log("- NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("- GOOGLE_CLIENT_ID 已设置:", !!process.env.GOOGLE_CLIENT_ID);
console.log("- GOOGLE_CLIENT_SECRET 已设置:", !!process.env.GOOGLE_CLIENT_SECRET);

// 检查代理设置
const proxyEnabled = !!(process.env.HTTP_PROXY || process.env.HTTPS_PROXY);
console.log("- 代理设置状态:", proxyEnabled ? "已启用" : "已禁用");

console.log("- DATABASE_URL 已设置:", hasDatabase);

// 创建NextAuth处理程序
const handler = NextAuth({
  // 当没有设置数据库时，不使用 PrismaAdapter，允许纯 JWT 模式运行
  ...(hasDatabase ? { adapter: PrismaAdapter(prisma) } : {}),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      httpOptions: {
        timeout: 30000, // 增加超时时间到30秒
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log("重定向回调:", { url, baseUrl });
      
      // 确保重定向到正确的URL
      if (url.startsWith("/")) {
        console.log("重定向到:", `${baseUrl}${url}`);
        return `${baseUrl}${url}`;
      } 
      else if (new URL(url).origin === baseUrl) {
        console.log("重定向到:", url);
        return url;
      }
      
      console.log("默认重定向到:", `${baseUrl}/generate`);
      return `${baseUrl}/generate`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  debug: true, // 始终启用调试以便排查问题
  logger: {
    error(code, ...message) {
      console.error("NextAuth错误:", code, ...message);
    },
    warn(code, ...message) {
      console.warn("NextAuth警告:", code, ...message);
    },
    debug(code, ...message) {
      console.log("NextAuth调试:", code, ...message);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // 移除 trustHost 属性，因为它不是 AuthOptions 类型的有效属性
});

export { handler as GET, handler as POST };
