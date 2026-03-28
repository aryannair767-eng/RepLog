import { prisma } from './src/lib/prisma'; prisma.setLog.findMany().then(x => console.dir(x, { depth: null }))
