import { PrismaClient } from '@prisma/client';

import idGenerator from '../src/libs/id-generator';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

prisma.$on('query' as never, (e: any) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});

async function main() {
  const alice = await prisma.user.create({
    data: {
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      type: 'SELLER',
      firstName: 'Alice',
      email: 'alice@prisma.io',
      username: 'alice',
      password:
        'adf43b82b4063a9759fb7b2d041015dd0e48f60783b27c6e0687329306850952b8059cf0d54c4175c799856de1bce72938dbd797c62883bd080d45e60df33693',
      salt: '43c6453dcfe82835eca275d9f0032e7d848c39250c58b03fa9efa9a2d673b99369a3cb44ba92f10817865c668f3e4bde0a1548df0815be1f47ac4f467d4b5d16',
    },
  });

  const bob = await prisma.user.create({
    data: {
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      type: 'SELLER',
      firstName: 'Bob',
      email: 'bob@prisma.io',
      username: 'bobs',
      password:
        'adf43b82b4063a9759fb7b2d041015dd0e48f60783b27c6e0687329306850952b8059cf0d54c4175c799856de1bce72938dbd797c62883bd080d45e60df33693',
      salt: '43c6453dcfe82835eca275d9f0032e7d848c39250c58b03fa9efa9a2d673b99369a3cb44ba92f10817865c668f3e4bde0a1548df0815be1f47ac4f467d4b5d16',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      type: 'SELLER',
      firstName: 'Charlie',
      email: 'charlie@prisma.io',
      username: 'charlie',
      password:
        'adf43b82b4063a9759fb7b2d041015dd0e48f60783b27c6e0687329306850952b8059cf0d54c4175c799856de1bce72938dbd797c62883bd080d45e60df33693',
      salt: '43c6453dcfe82835eca275d9f0032e7d848c39250c58b03fa9efa9a2d673b99369a3cb44ba92f10817865c668f3e4bde0a1548df0815be1f47ac4f467d4b5d16',
    },
  });

  const danny = await prisma.user.create({
    data: {
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      type: 'SELLER',
      firstName: 'Danny',
      email: 'danny@prisma.io',
      username: 'danny',
      password:
        'adf43b82b4063a9759fb7b2d041015dd0e48f60783b27c6e0687329306850952b8059cf0d54c4175c799856de1bce72938dbd797c62883bd080d45e60df33693',
      salt: '43c6453dcfe82835eca275d9f0032e7d848c39250c58b03fa9efa9a2d673b99369a3cb44ba92f10817865c668f3e4bde0a1548df0815be1f47ac4f467d4b5d16',
    },
  });

  const elena = await prisma.user.create({
    data: {
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      type: 'SELLER',
      firstName: 'Elena',
      email: 'elena@prisma.io',
      username: 'elena',
      password:
        'adf43b82b4063a9759fb7b2d041015dd0e48f60783b27c6e0687329306850952b8059cf0d54c4175c799856de1bce72938dbd797c62883bd080d45e60df33693',
      salt: '43c6453dcfe82835eca275d9f0032e7d848c39250c58b03fa9efa9a2d673b99369a3cb44ba92f10817865c668f3e4bde0a1548df0815be1f47ac4f467d4b5d16',
    },
  });

  const store = await prisma.store.create({
    data: {
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      prefix: 'ac',
      name: 'A Canteen',
      slug: 'a-canteen',
      taxes: [
        {
          key: 'CGST',
          name: 'CGST',
          printName: 'CGST',
          type: 'PERCENTAGE',
          rate: 5,
          position: 2,
        },
        {
          key: 'SGST',
          name: 'SGST',
          printName: 'SGST',
          type: 'PERCENTAGE',
          rate: 5,
          position: 1,
        },
      ],
      fees: [
        {
          key: 'DELIVERY',
          name: 'DELIVERY',
          printName: 'Delivery',
          type: 'VALUE',
          rate: 35,
          position: 2,
        },
        {
          key: 'PACKING',
          name: 'PACKING',
          printName: 'Packing',
          type: 'VALUE_COUNT',
          rate: 10,
          position: 1,
        },
      ],
      tables: [
        {
          key: 'T1',
          name: 'T1',
          printName: 'T1',
          position: 1,
        },
        {
          key: 'T2',
          name: 'T2',
          printName: 'T2',
          position: 2,
        },
        {
          key: 'T3',
          name: 'T3',
          printName: 'T3',
          position: 3,
        },
        {
          key: 'T4',
          name: 'T4',
          printName: 'T4',
          position: 4,
        },
      ],
      address: {
        line1: 'New street',
        state: 'Tamil Nadu',
        county: 'India',
        pincode: '606601',
      },
      printHead: ['A CANTEEN FOODS'],
      printDeck: ['No. 20/10, Gandhi Nagar', 'Thiruvannmalai, Tamil Nadu - 606601', 'GSTIN: HSU677SHS6D88D0J'],
      printFooter: ['Thank you. Visit Again.'],
    },
  });

  const storeId = store.id;
  await prisma.usersOnStores.createMany({
    data: [
      {
        userId: alice.id,
        storeId,
        originated: true,
      },
      {
        userId: bob.id,
        storeId,
        originated: true,
      },
      {
        userId: charlie.id,
        storeId,
        originated: true,
      },
      {
        userId: danny.id,
        storeId,
        originated: true,
      },
      {
        userId: elena.id,
        storeId,
        originated: true,
      },
    ],
  });

  await prisma.category.create({
    data: {
      name: 'Briyani',
      deck: 'The Special Briyani pot',
      position: 1,
      storeId,
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      products: {
        createMany: {
          data: [
            {
              name: 'Mutton Briyani',
              deck: 'The Mutton Briyani Pot',
              price: 350,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Mutton Briyani Food',
                  altText: 'The Mutton Briyani pot',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://media.istockphoto.com/id/980036908/photo/gosht-or-lamb-biryani-prepared-in-basmati-rice-served-with-yogurt-dip-in-terracotta-bowl.jpg?s=1024x1024&w=is&k=20&c=3ZSUuA6nf9xmdX3pWyTcb7iGTme8HudkXOe3bUJDl-c=',
                },
              ],
            },
            {
              name: 'Chicken Briyani',
              deck: 'The Chicken Briyani Pot',
              price: 250,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Briyani Food',
                  altText: 'The Briyani pot',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1642821373181-696a54913e93?q=80&w=4740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
          ],
        },
      },
    },
  });

  await prisma.category.create({
    data: {
      name: 'Dessert',
      deck: 'The Delicious Dessert',
      position: 2,
      storeId,
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      products: {
        create: [
          {
            id: idGenerator.generateShortID(),
            shortId: idGenerator.generateShortID(),
            name: 'Raspberries and Pistachio Cake',
            deck: 'Delicious cake with pistachio and raspberries',
            price: 100,
            storeId: storeId,
            images: [
              {
                caption: 'Raspberries and Pistachio Cake',
                altText: 'Delicious cake with pistachio and raspberries',
                type: 'URL',
                position: 1,
                value:
                  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              },
            ],
          },
          {
            name: 'Chocolate Donuts',
            deck: 'Delicious donuts with chocolate',
            price: 150,
            storeId: storeId,
            id: idGenerator.generateShortID(),
            shortId: idGenerator.generateShortID(),
            images: [
              {
                caption: 'Chocolate Donuts',
                altText: 'Delicious donuts with chocolate',
                type: 'URL',
                position: 1,
                value:
                  'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?q=80&w=2837&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              },
            ],
          },
        ],
      },
    },
  });
  return true;
}
main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    console.error(e);
    process.exit(1);
  });
