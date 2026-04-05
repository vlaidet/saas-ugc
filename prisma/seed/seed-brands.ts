/**
 * Script de seed pour réimporter les 470 marques initiales.
 *
 * Usage :
 *   npx tsx prisma/seed/seed-brands.ts <userId> [--reset]
 *
 * Options :
 *   --reset  Supprime toutes les marques existantes de l'utilisateur avant l'import
 *
 * Charge automatiquement .env.local pour DATABASE_URL.
 */
import { PrismaClient } from "../../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";

config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    "DATABASE_URL manquante. Ajouter un .env.local ou exporter la variable.",
  );
  process.exit(1);
}

const userId = process.argv[2];
const reset = process.argv.includes("--reset");

if (!userId) {
  console.error("Usage: npx tsx prisma/seed/seed-brands.ts <userId> [--reset]");
  process.exit(1);
}

type BrandData = {
  name: string;
  niche: string;
  channel: string;
  status: string;
  email: string | null;
  product: string | null;
  notes: string | null;
  profileUrl: string | null;
};

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const jsonPath = join(__dirname, "brands-seed.json");
  const brands: BrandData[] = JSON.parse(readFileSync(jsonPath, "utf-8"));

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.error(`Utilisateur ${userId} introuvable.`);
    process.exit(1);
  }
  console.log(`Utilisateur: ${user.name} (${user.email})`);

  if (reset) {
    const deleted = await prisma.brand.deleteMany({ where: { userId } });
    console.log(`${deleted.count} marques supprimées (--reset).`);
  }

  const existingBrands = await prisma.brand.findMany({
    where: { userId },
    select: { name: true },
  });
  const existingNames = new Set(
    existingBrands.map((b) => b.name.toLowerCase()),
  );

  const toInsert = brands.filter((b) => {
    if (existingNames.has(b.name.toLowerCase())) return false;
    existingNames.add(b.name.toLowerCase());
    return true;
  });

  const skipped = brands.length - toInsert.length;

  if (toInsert.length > 0) {
    await prisma.brand.createMany({
      data: toInsert.map((b) => ({
        name: b.name,
        niche: b.niche,
        channel: b.channel,
        status: b.status,
        email: b.email,
        product: b.product,
        notes: b.notes,
        profileUrl: b.profileUrl,
        userId,
      })),
    });
  }

  console.log(
    `${toInsert.length} marques importées, ${skipped} ignorées (doublons).`,
  );
}

main()
  .catch((e) => {
    console.error("Erreur:", e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
