const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seed() {
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: '$2b$10$QLoZHYEaFaJWHXfH/yx7T.h.2c5iudI0Igy7yIy9TkT7X8RTp4C46',
      role: 'ADMIN',
      name: 'Admin',
      nasc: new Date('1999-01-01'),
      weight: 80,
      height: 180,
      gender: 'MASCULINO',
      workouts: {
        create: [
          {
            name: 'Treino A',
            exercises: {
              create: [
                {
                  name: 'Supino Reto',
                  sets: 4,
                  reps: '8',
                },
                {
                  name: 'Supino Inclinado',
                  sets: 4,
                  reps: '8',
                },
                {
                  name: 'Supino Declinado',
                  sets: 4,
                  reps: '8',
                },
              ],
            },
            madeById: 1,
          },
          {
            name: 'Treino B',
            exercises: {
              create: [
                {
                  name: 'Agachamento',
                  sets: 4,
                  reps: '8',
                },
                {
                  name: 'Leg Press',
                  sets: 4,
                  reps: '8',
                },
                {
                  name: 'Cadeira Extensora',
                  sets: 3,
                  reps: '12',
                },
              ],
            },
            madeById: 1,
          },
        ],
      },
    },
  })

  const user1 = await prisma.user.create({
    data: {
      email: '1@gmail.com',
      password: '$2b$10$QLoZHYEaFaJWHXfH/yx7T.h.2c5iudI0Igy7yIy9TkT7X8RTp4C46',
      role: 'USER',
      name: 'Carlos Henrique',
      nasc: new Date('2003-01-01'),
      weight: 100,
      height: 173,
      gender: 'MASCULINO',
      workouts: {
        create: [
          {
            name: 'Treino Biceps',
            exercises: {
              create: [
                {
                  name: 'Rosca Direta',
                  sets: 3,
                  reps: '8',
                },
                {
                  name: 'Rosca Alternada',
                  sets: 3,
                  reps: '12',
                },
                {
                  name: 'Rosca Concentrada',
                  sets: 3,
                  reps: '12',
                },
              ],
            },
            madeById: 2,
          },
        ],
      },
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: '2@gmail.com',
      password: '$2b$10$QLoZHYEaFaJWHXfH/yx7T.h.2c5iudI0Igy7yIy9TkT7X8RTp4C46',
      role: 'PREMIUM',
      name: 'Talita Silva',
      nasc: new Date('2005-03-02'),
      weight: 68,
      height: 173,
      gender: 'FEMININO',
      workouts: {
        create: [
          {
            name: 'Treino Panturrilha',
            exercises: {
              create: [
                {
                  name: 'Panturrilha Sentado',
                  sets: 3,
                  reps: '12',
                },
                {
                  name: 'Panturrilha Em Pé',
                  sets: 3,
                  reps: '12',
                },
              ],
            },
            madeById: 3,
          },
        ],
      },
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: '3@gmail.com',
      password: '$2b$10$QLoZHYEaFaJWHXfH/yx7T.h.2c5iudI0Igy7yIy9TkT7X8RTp4C46',
      role: 'PERSONAL',
      name: 'Rodrigo Santos',
      nasc: new Date('2001-05-02'),
      weight: 83,
      height: 185,
      gender: 'MASCULINO',
    },
  })

  const message1 = await prisma.message.create({
    data: {
      fromUserId: 3,
      toUserId: 4,
      text: 'Olá, acha que poderia me ajudar com um treino?',
    },
  })

  const message2 = await prisma.message.create({
    data: {
      fromUserId: 4,
      toUserId: 3,
      text: 'Olá, com certeza, o que você precisa?',
    },
  })

  const message3 = await prisma.message.create({
    data: {
      fromUserId: 3,
      toUserId: 4,
      text: 'Eu queria um treino para crescer muito as costas, adoraria ficar mais largo atrás.',
    },
  })

  const message4 = await prisma.message.create({
    data: {
      fromUserId: 4,
      toUserId: 3,
      text: 'Entendi, vou te passar um treino que eu gosto muito para alargar atrás, acho que vai te ajudar.',
    },
  })

  const message5 = await prisma.message.create({
    data: {
      fromUserId: 4,
      toUserId: 3,
      text: 'Criei o treino para você, quer mudar algo ou consegue tentar assim?',
    },
  })

  const message6 = await prisma.message.create({
    data: {
      fromUserId: 3,
      toUserId: 4,
      text: 'Obrigado, vou tentar assim mesmo, qualquer coisa te chamo.',
    },
  })

  const message7 = await prisma.message.create({
    data: {
      fromUserId: 4,
      toUserId: 3,
      text: 'Ok, estou a disposição!',
    },
  })

  const workout1 = await prisma.workout.create({
    data: {
      userId: 3,
      name: 'Treino Costas',
      exercises: {
        create: [
          {
            name: 'Puxada Frontal',
            sets: 3,
            reps: '12',
          },
          {
            name: 'Remada Curvada',
            sets: 3,
            reps: '10',
          },
          {
            name: 'Remada Unilateral',
            sets: 3,
            reps: '10',
          },
        ],
      },
      madeById: 4,
    },
  })

  const log1 = await prisma.workoutLog.create({
    data: {
      workoutId: 4,
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
  })

  const log2 = await prisma.workoutLog.create({
    data: {
      workoutId: 4,
      date: new Date(new Date().setDate(new Date().getDate() - 3)),
    },
  })

  const log3 = await prisma.workoutLog.create({
    data: {
      workoutId: 4,
      date: new Date(new Date().setDate(new Date().getDate() - 5)),
    },
  })

  const log4 = await prisma.workoutLog.create({
    data: {
      workoutId: 5,
      date: new Date(),
    },
  })

  console.log({
    admin,
    user1,
    user2,
    user3,
    message1,
    message2,
    message3,
    message4,
    message5,
    message6,
    message7,
    workout1,
    log1,
    log2,
    log3,
    log4,
  })
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
