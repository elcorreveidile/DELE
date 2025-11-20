import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  // Evita que Next infiera un root fuera del proyecto cuando hay múltiples lockfiles
  outputFileTracingRoot: path.join(__dirname),
}

export default nextConfig
