const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const plugins = await prisma.plugin.findMany();
  console.log(plugins.map(p => ({ id: p.id, name: p.name })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
