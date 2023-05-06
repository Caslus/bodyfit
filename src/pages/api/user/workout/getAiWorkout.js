import { getToken } from 'next-auth/jwt'
import prisma from '@/db/prisma'

export default async (req, res) => {
  const token = await getToken({ req })
  if (token) {
    const requester = await prisma.user.findUnique({
      where: {
        id: token.user.user.id,
      },
      select: {
        weight: true,
        height: true,
        gender: true,
      },
    })
    if (!requester) {
      return res.status(404).json({ error: 'Erro ao executar ação' })
    }

    if (req.method == 'POST') {
      const data = JSON.parse(req.body)
      let exercisesNumber = data.exercisesNumber
      let workoutFocus = data.workoutFocus
      let workoutObjective = data.workoutObjective
      let gender = 'uma pessoa'
      if (requester.gender == 'MASCULINO') {
        gender = 'um homem'
      } else if (requester.gender == 'FEMININO') {
        gender = 'uma mulher'
      }
      const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: process.env.GPT_TOKEN,
      })
      const body = {
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: `Você é uma máquina em uma academia e deve retornar um treino contendo número de séries, repetições e nome do exercício baseado no objetivo que o atleta deseja alcançar. A resposta deve incluir apenas um JSON, sendo assim, não fale nada além dos exercícios. Não inclua qualquer tipo de explicação ou texto além do JSON. A resposta deve incluir um objeto contendo uma lista de objetos com as chaves sets, name e reps. Exemplo de resposta: {"treino":[{"name":"Exemplo", "sets":3, "reps":12}]}`,
          },
          {
            role: 'user',
            content: `Sou ${gender} de ${requester.weight}kg e preciso de um treino de ${workoutFocus} com exato(s) ${exercisesNumber} exercício(s) para ${workoutObjective}}`,
          },
        ],
      }
      const config = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      }
      const workout = await fetch(process.env.GPT_URL, config)
        .then((response) => response.json())
        .then((response) => {
          if (
            response?.choices &&
            response.choices[0] &&
            response?.choices[0]?.finish_reason == 'stop'
          ) {
            if (
              response.choices[0].message.content.substring(
                response.choices[0].message.content.length - 1
              ) == '.'
            ) {
              response.choices[0].message.content =
                response.choices[0].message.content.substring(
                  0,
                  response.choices[0].message.content.length - 1
                )
            }
            return res
              .status(200)
              .json({ workout: response.choices[0].message.content })
          }
          if (response?.error) {
            return res
              .status(404)
              .json({ error: 'Houve um erro ao gerar o treino' })
          }
        })
        .catch(() => {
          return res
            .status(404)
            .json({ error: 'Não foi possível gerar um treino' })
        })
    }
  }
}
