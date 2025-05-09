// // import { NextResponse } from "next/server";
// // import { getToken } from "next-auth/jwt";
// // import { NextRequest } from "next/server";

// // const publicRoutes = ["/landing", "/prices"];
// // const authRoutes = ["/auth/login", "/register"];
// // const apiAuthPrefix = "/api/auth";

// // const protectedRoutes = [
// //   { path: "/admin", roles: ["admin"] },
// //   { path: "/dashboard", roles: ["admin", "user"] },
// // ];

// // export async function middleware(req: NextRequest) {
// //   if (!process.env.AUTH_SECRET) {
// //     throw new Error("AUTH_SECRET environment variable is not defined");
// //   }

// //   // Agregar registros de depuración
// //   console.log("AUTH_SECRET:", process.env.AUTH_SECRET);
// //   console.log("Request Headers:", req.headers);

// //   // Verificar la cookie de sesión
// //   const cookies = req.headers.get("cookie");
// //   console.log("Cookies:", cookies);

// //   const token = await getToken({
// //     req,
// //     secret: process.env.AUTH_SECRET,
// //     cookieName: "__Host-authjs.csrf-token",
// //   });

// //   // Más registros de depuración
// //   console.log("Token:", token);
// //   // console.log("Request:", req);

// //   const { nextUrl } = req;
// //   const isLoggedIn = !!token;

// //   console.log({ isLoggedIn, path: nextUrl.pathname });

// //   // Permitir todas las rutas de API de autenticación
// //   if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
// //     return NextResponse.next();
// //   }

// //   // Permitir acceso a rutas públicas sin importar el estado de autenticación
// //   if (publicRoutes.includes(nextUrl.pathname)) {
// //     return NextResponse.next();
// //   }

// //   // Redirigir a /dashboard si el usuario está logueado y trata de acceder a rutas de autenticación
// //   if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
// //     return NextResponse.redirect(new URL("/dashboard", nextUrl));
// //   }

// //   // Redirigir a /login si el usuario no está logueado y trata de acceder a una ruta protegida
// //   if (
// //     !isLoggedIn &&
// //     !authRoutes.includes(nextUrl.pathname) &&
// //     !publicRoutes.includes(nextUrl.pathname)
// //   ) {
// //     return NextResponse.redirect(new URL("/auth/login", nextUrl));
// //   }

// //   // Verificar roles para rutas protegidas
// //   const route = protectedRoutes.find((route) =>
// //     nextUrl.pathname.startsWith(route.path)
// //   );
// //   if (route && !route.roles.includes(token?.role as string)) {
// //     return NextResponse.redirect(new URL("/auth/access", nextUrl));
// //   }

// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// // };
// import { NextResponse } from "next/server";
// import { auth } from "./auth-v5";

// const publicRoutes = ["/landing", "/prices"];
// const authRoutes = ["/auth/login", "/register"];
// const apiAuthPrefix = "/api/auth";
// const protectedRoutes = [
//   { path: "/admin", roles: ["admin"] },
//   { path: "/dashboard", roles: ["admin", "user"] },
// ];

// export default auth(async function middleware(req) {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;

//   // Log the request URL and authentication status
//   console.log("Request URL:", nextUrl.href);
//   console.log("Authentication status:", req.auth);

//   // Verificar si el usuario está autenticado
//   // if (!req.auth) {
//   //   // Redirigir a login si no está autenticado
//   //   return NextResponse.redirect(new URL("/auth/login", nextUrl));
//   // }

//   // Permitir todas las rutas de API de autenticación
//   if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
//     return NextResponse.next();
//   }

//   // Permitir acceso a rutas públicas sin importar el estado de autenticación
//   if (publicRoutes.includes(nextUrl.pathname)) {
//     return NextResponse.next();
//   }

//   // Redirigir a /dashboard si el usuario está logueado y trata de acceder a rutas de autenticación
//   if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
//     return NextResponse.redirect(new URL("/dashboard", nextUrl));
//   }

//   // Redirigir a /login si el usuario no está logueado y trata de acceder a una ruta protegida
//   if (
//     !isLoggedIn &&
//     !authRoutes.includes(nextUrl.pathname) &&
//     !publicRoutes.includes(nextUrl.pathname)
//   ) {
//     return NextResponse.redirect(new URL("/auth/login", nextUrl));
//   }

//   // // Verificar roles para rutas protegidas
//   // const route = protectedRoutes.find((route) =>
//   //   nextUrl.pathname.startsWith(route.path)
//   // );
//   // if (route && !route.roles.includes(token?.role as string)) {
//   //   return NextResponse.redirect(new URL("/auth/access", nextUrl));
//   // }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
