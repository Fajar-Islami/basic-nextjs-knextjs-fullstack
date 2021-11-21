import cookies from "next-cookies";

export function unauthPage(ctx) {
  const allCookies = cookies(ctx);

  if (allCookies.token) {
    return {
      redirect: {
        destination: "/posts",
        permanent: false,
      },
    };
  }
}

export function authPage(ctx) {
  const allCookies = cookies(ctx);

  if (!allCookies.token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return { token: allCookies.token };
}
