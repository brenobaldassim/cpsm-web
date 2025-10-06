import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create 5 sample clients
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { cpf: '123.456.789-09' },
      update: {},
      create: {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao.silva@example.com',
        cpf: '123.456.789-09',
        socialMedia: '@joaosilva',
        createdBy: admin.id,
        addresses: {
          create: [
            {
              type: 'HOME',
              street: 'Rua das Flores',
              number: '123',
              city: 'São Paulo',
              state: 'SP',
              cep: '01234-567',
            },
          ],
        },
      },
    }),
    prisma.client.upsert({
      where: { cpf: '987.654.321-00' },
      update: {},
      create: {
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@example.com',
        cpf: '987.654.321-00',
        socialMedia: '@mariasantos',
        createdBy: admin.id,
        addresses: {
          create: [
            {
              type: 'HOME',
              street: 'Av. Paulista',
              number: '1000',
              city: 'São Paulo',
              state: 'SP',
              cep: '01310-100',
            },
            {
              type: 'WORK',
              street: 'Rua Augusta',
              number: '500',
              city: 'São Paulo',
              state: 'SP',
              cep: '01305-000',
            },
          ],
        },
      },
    }),
    prisma.client.upsert({
      where: { cpf: '111.222.333-44' },
      update: {},
      create: {
        firstName: 'Pedro',
        lastName: 'Oliveira',
        email: 'pedro.oliveira@example.com',
        cpf: '111.222.333-44',
        createdBy: admin.id,
        addresses: {
          create: [
            {
              type: 'HOME',
              street: 'Rua do Comércio',
              number: '789',
              city: 'Rio de Janeiro',
              state: 'RJ',
              cep: '20000-000',
            },
          ],
        },
      },
    }),
    prisma.client.upsert({
      where: { cpf: '555.666.777-88' },
      update: {},
      create: {
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana.costa@example.com',
        cpf: '555.666.777-88',
        socialMedia: '@anacosta',
        createdBy: admin.id,
        addresses: {
          create: [
            {
              type: 'WORK',
              street: 'Av. Atlântica',
              number: '2000',
              city: 'Rio de Janeiro',
              state: 'RJ',
              cep: '22021-001',
            },
          ],
        },
      },
    }),
    prisma.client.upsert({
      where: { cpf: '999.888.777-66' },
      update: {},
      create: {
        firstName: 'Carlos',
        lastName: 'Ferreira',
        email: 'carlos.ferreira@example.com',
        cpf: '999.888.777-66',
        createdBy: admin.id,
        addresses: {
          create: [
            {
              type: 'HOME',
              street: 'Rua das Palmeiras',
              number: '456',
              city: 'Belo Horizonte',
              state: 'MG',
              cep: '30130-000',
            },
          ],
        },
      },
    }),
  ])
  console.log(`✅ Created ${clients.length} clients`)

  // Create 10 sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'seed-prod-1' },
      update: {},
      create: {
        id: 'seed-prod-1',
        name: 'Laptop Dell Inspiron',
        priceInCents: 250000, // R$ 2,500.00
        stockQty: 20,
        createdBy: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'seed-prod-2' },
      update: {},
      create: {
        id: 'seed-prod-2',
        name: 'Mouse Logitech MX Master',
        priceInCents: 35000, // R$ 350.00
        stockQty: 50,
        createdBy: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'seed-prod-3' },
      update: {},
      create: {
        id: 'seed-prod-3',
        name: 'Teclado Mecânico Keychron',
        priceInCents: 45000, // R$ 450.00
        stockQty: 30,
        createdBy: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'seed-prod-4' },
      update: {},
      create: {
        id: 'seed-prod-4',
        name: 'Monitor LG 27"',
        priceInCents: 120000, // R$ 1,200.00
        stockQty: 15,
        createdBy: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'seed-prod-5' },
      update: {},
      create: {
        id: 'seed-prod-5',
        name: 'Webcam Logitech C920',
        priceInCents: 55000, // R$ 550.00
        stockQty: 25,
        createdBy: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'seed-prod-6' },
      update: {},
      create: {
        id: 'seed-prod-6',
        name: 'Headset HyperX Cloud',
        priceInCents: 40000, // R$ 400.00
        stockQty: 40,
        createdBy: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'seed-prod-7' },
      update: {},
      create: {
        id: 'seed-prod-7',
        name: 'SSD Samsung 1TB',
        priceInCents: 65000, // R$ 650.00
        stockQty: 35,
        createdBy: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'seed-prod-8' },
      update: {},
      create: {
        id: 'seed-prod-8',
        name: 'Memória RAM 16GB',
        priceInCents: 38000, // R$ 380.00
        stockQty: 45,
        createdBy: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'seed-prod-9' },
      update: {},
      create: {
        id: 'seed-prod-9',
        name: 'Placa de Vídeo GTX 1660',
        priceInCents: 180000, // R$ 1,800.00
        stockQty: 10,
        createdBy: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'seed-prod-10' },
      update: {},
      create: {
        id: 'seed-prod-10',
        name: 'Gabinete Gamer RGB',
        priceInCents: 28000, // R$ 280.00
        stockQty: 20,
        createdBy: admin.id,
      },
    }),
  ])
  console.log(`✅ Created ${products.length} products`)

  // Create 20 sample sales over the last 60 days
  const now = new Date()
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 60)
    const saleDate = new Date(now)
    saleDate.setDate(saleDate.getDate() - daysAgo)

    const randomClient = clients[Math.floor(Math.random() * clients.length)]
    const numItems = Math.floor(Math.random() * 3) + 1 // 1-3 items

    const saleItems = []
    let totalAmount = 0

    for (let j = 0; j < numItems; j++) {
      const randomProduct =
        products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const lineTotal = randomProduct.priceInCents * quantity

      saleItems.push({
        productId: randomProduct.id,
        quantity,
        priceInCents: randomProduct.priceInCents,
      })

      totalAmount += lineTotal
    }

    await prisma.sale.create({
      data: {
        clientId: randomClient.id,
        saleDate,
        totalAmount,
        createdBy: admin.id,
        saleItems: {
          create: saleItems,
        },
      },
    })
  }
  console.log('✅ Created 20 sample sales')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
