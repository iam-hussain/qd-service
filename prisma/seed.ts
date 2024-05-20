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

  const kitchenCategories = await Promise.all(
    [
      {
        id: idGenerator.generateShortID(),
        shortId: idGenerator.generateShortID(),
        name: 'Italian Kitchen',
        deck: 'Delicious Italian cuisine with authentic flavors',
        position: 1,
        type: 'KITCHEN',
        storeId,
      },
      {
        id: idGenerator.generateShortID(),
        shortId: idGenerator.generateShortID(),
        name: 'Mexican Kitchen',
        deck: 'Spicy and flavorful Mexican dishes',
        position: 2,
        type: 'KITCHEN',
        storeId,
      },
      {
        id: idGenerator.generateShortID(),
        shortId: idGenerator.generateShortID(),
        name: 'Indian Kitchen',
        deck: 'Rich and diverse Indian cuisine',
        position: 3,
        type: 'KITCHEN',
        storeId,
      },
      {
        id: idGenerator.generateShortID(),
        shortId: idGenerator.generateShortID(),
        name: 'Chinese Kitchen',
        deck: 'Authentic Chinese flavors and dishes',
        position: 4,
        type: 'KITCHEN',
        storeId,
      },
    ].map((e) => prisma.category.create({ data: e as any }))
  );

  const categories = [
    {
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
                    'https://images.unsplash.com/photo-1696265350630-efa107c33990?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
                    'https://images.unsplash.com/photo-1701579231349-d7459c40919d?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Egg Briyani',
              deck: 'The Egg Briyani Pot',
              price: 200,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Egg Briyani Food',
                  altText: 'The Egg Briyani pot',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1642821373181-696a54913e93?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Vegetable Briyani',
              deck: 'The Vegetable Briyani Pot',
              price: 180,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Vegetable Briyani Food',
                  altText: 'The Vegetable Briyani pot',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://plus.unsplash.com/premium_photo-1694141252774-c937d97641da?q=80&h=300&ar=5:4&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Fish Briyani',
              deck: 'The Fish Briyani Pot',
              price: 300,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Fish Briyani Food',
                  altText: 'The Fish Briyani pot',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1691171047312-d809eccef46d?q=80&h=300&ar=5:4&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: 'Dessert',
      deck: 'The Delicious Dessert',
      position: 2,
      storeId,
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      products: {
        createMany: {
          data: [
            {
              name: 'Raspberries and Pistachio Cake',
              deck: 'Delicious cake with pistachio and raspberries',
              price: 100,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Raspberries and Pistachio Cake',
                  altText: 'Delicious cake with pistachio and raspberries',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
            {
              name: 'Tiramisu',
              deck: 'Classic Italian dessert',
              price: 200,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Tiramisu',
                  altText: 'Classic Italian dessert',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1567608286687-394db5f7520a?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Lemon Tart',
              deck: 'Tangy and sweet lemon tart',
              price: 180,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Lemon Tart',
                  altText: 'Tangy and sweet lemon tart',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1543508185-225c92847541?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Cheesecake',
              deck: 'Creamy and delicious cheesecake',
              price: 220,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Cheesecake',
                  altText: 'Creamy and delicious cheesecake',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1578775887804-699de7086ff9?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: 'Drinks',
      deck: 'Refreshing Beverages',
      position: 3,
      storeId,
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      products: {
        createMany: {
          data: [
            {
              name: 'Mango Smoothie',
              deck: 'Refreshing mango smoothie',
              price: 120,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Mango Smoothie',
                  altText: 'Refreshing mango smoothie',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1623400518626-6ea9ab64c5ec?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Lemonade',
              deck: 'Refreshing lemonade',
              price: 80,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Lemonade',
                  altText: 'Refreshing lemonade',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1583064313642-a7c149480c7e?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Iced Coffee',
              deck: 'Cold and refreshing iced coffee',
              price: 150,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Iced Coffee',
                  altText: 'Cold and refreshing iced coffee',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Strawberry Milkshake',
              deck: 'Delicious strawberry milkshake',
              price: 140,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Strawberry Milkshake',
                  altText: 'Delicious strawberry milkshake',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://plus.unsplash.com/premium_photo-1669686982303-7da68cdd4595?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Green Tea',
              deck: 'Healthy and refreshing green tea',
              price: 90,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Green Tea',
                  altText: 'Healthy and refreshing green tea',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1685156328670-bad82b790a56?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: 'Appetizers',
      deck: 'Tasty Starters',
      position: 4,
      storeId,
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      products: {
        createMany: {
          data: [
            {
              name: 'Spring Rolls',
              deck: 'Crispy and delicious spring rolls',
              price: 200,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Spring Rolls',
                  altText: 'Crispy and delicious spring rolls',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1515022376298-7333f33e704b?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Garlic Bread',
              deck: 'Warm and buttery garlic bread',
              price: 150,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Garlic Bread',
                  altText: 'Warm and buttery garlic bread',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Bruschetta',
              deck: 'Toasted bread with tomato and basil',
              price: 180,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Bruschetta',
                  altText: 'Toasted bread with tomato and basil',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Stuffed Mushrooms',
              deck: 'Delicious mushrooms stuffed with cheese',
              price: 220,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Stuffed Mushrooms',
                  altText: 'Delicious mushrooms stuffed with cheese',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://plus.unsplash.com/premium_photo-1664299044809-49dfceba749a?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Chicken Wings',
              deck: 'Spicy and crispy chicken wings',
              price: 250,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Chicken Wings',
                  altText: 'Spicy and crispy chicken wings',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1624726175512-19b9baf9fbd1?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: 'Salads',
      deck: 'Fresh and Healthy Salads',
      position: 5,
      storeId,
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      products: {
        createMany: {
          data: [
            {
              name: 'Caesar Salad',
              deck: 'Classic Caesar salad with croutons and cheese',
              price: 180,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Caesar Salad',
                  altText: 'Classic Caesar salad with croutons and cheese',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Greek Salad',
              deck: 'Fresh Greek salad with olives and feta cheese',
              price: 160,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Greek Salad',
                  altText: 'Fresh Greek salad with olives and feta cheese',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Quinoa Salad',
              deck: 'Healthy quinoa salad with vegetables',
              price: 200,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Quinoa Salad',
                  altText: 'Healthy quinoa salad with vegetables',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1615865417491-9941019fbc00?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Caprese Salad',
              deck: 'Fresh Caprese salad with tomatoes and mozzarella',
              price: 190,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Caprese Salad',
                  altText: 'Fresh Caprese salad with tomatoes and mozzarella',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1595587870672-c79b47875c6a?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Fruit Salad',
              deck: 'Fresh and juicy fruit salad',
              price: 150,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Fruit Salad',
                  altText: 'Fresh and juicy fruit salad',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1588068403046-169c80c69938?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: 'Pizza',
      deck: 'Delicious and Cheesy Pizzas',
      position: 6,
      storeId,
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      products: {
        createMany: {
          data: [
            {
              name: 'Margherita Pizza',
              deck: 'Classic Margherita pizza with fresh basil',
              price: 250,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Margherita Pizza',
                  altText: 'Classic Margherita pizza with fresh basil',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Pepperoni Pizza',
              deck: 'Spicy pepperoni pizza with mozzarella',
              price: 280,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Pepperoni Pizza',
                  altText: 'Spicy pepperoni pizza with mozzarella',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1628840042765-356cda07504e??q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'BBQ Chicken Pizza',
              deck: 'Delicious BBQ chicken pizza',
              price: 300,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'BBQ Chicken Pizza',
                  altText: 'Delicious BBQ chicken pizza',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1655471264223-b07ce84d521c?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Veggie Pizza',
              deck: 'Healthy veggie pizza with fresh vegetables',
              price: 260,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Veggie Pizza',
                  altText: 'Healthy veggie pizza with fresh vegetables',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Hawaiian Pizza',
              deck: 'Tasty Hawaiian pizza with ham and pineapple',
              price: 290,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Hawaiian Pizza',
                  altText: 'Tasty Hawaiian pizza with ham and pineapple',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1613564834361-9436948817d1?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: 'Desserts',
      deck: 'Sweet and Delicious Desserts',
      position: 7,
      storeId,
      id: idGenerator.generateShortID(),
      shortId: idGenerator.generateShortID(),
      products: {
        createMany: {
          data: [
            {
              name: 'Chocolate Cake',
              deck: 'Rich and moist chocolate cake',
              price: 200,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Chocolate Cake',
                  altText: 'Rich and moist chocolate cake',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1607920591413-4ec007e70023?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Cheesecake',
              deck: 'Creamy and delicious cheesecake',
              price: 220,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Cheesecake',
                  altText: 'Creamy and delicious cheesecake',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Tiramisu',
              deck: 'Classic Italian tiramisu',
              price: 230,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Tiramisu',
                  altText: 'Classic Italian tiramisu',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1624001934657-640af7e2c599?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Ice Cream Sundae',
              deck: 'Delicious ice cream sundae with toppings',
              price: 180,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Ice Cream Sundae',
                  altText: 'Delicious ice cream sundae with toppings',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1447195047884-0f014b0d9288?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
            {
              name: 'Apple Pie',
              deck: 'Classic apple pie with a flaky crust',
              price: 210,
              storeId: storeId,
              id: idGenerator.generateShortID(),
              shortId: idGenerator.generateShortID(),
              images: [
                {
                  caption: 'Apple Pie',
                  altText: 'Classic apple pie with a flaky crust',
                  type: 'URL',
                  position: 1,
                  value:
                    'https://images.unsplash.com/photo-1572383672419-ab35444a6934?q=80&h=300&ar=5:4&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              ],
            },
          ],
        },
      },
    },
  ];

  categories.forEach(async (category, i) => {
    await prisma.category.create({
      data: {
        ...category,
        products: {
          createMany: {
            data: category.products.createMany.data.map((e) => ({
              ...e,
              kitchenCategoryId: kitchenCategories[i > 3 ? i - 3 : i].id,
            })),
          },
        },
      },
    });
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
