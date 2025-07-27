import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/auth", "routes/auth.tsx"),
  route("/upload", "routes/upload.tsx"),
  route("/cv/:id", "routes/cv.tsx"),
  route("/wipe", "routes/wipe.tsx"),
  route("/theme-test", "routes/theme-test.tsx"), // Theme system demo page
] satisfies RouteConfig;