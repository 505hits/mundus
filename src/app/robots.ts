import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules:[
      {
        userAgent:"*",
        allow:["/","/sk/","/en/","/languages","/languages/","/learn/","/pricing","/group-lessons","/companies","/contact","/privacy","/terms","/cookies"],
        disallow:["/admin/","/teacher/","/dashboard","/lessons","/learning","/progress","/feedback","/level-test","/progress-test","/packages","/company/","/api/","/auth/","/signup","/login","/forgot-password","/reset-password","/onboarding","/newsletter/confirmed","/newsletter/unsubscribe"],
      },
    ],
    sitemap:"https://munduslanguages.com/sitemap.xml",
    host:"https://munduslanguages.com",
  };
}
