import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { FaUserCircle } from 'react-icons/fa'
import Navbar from '@/components/Navbar'
import { set } from 'react-hook-form'

export default function Chat() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const currentChatId = router.query.id
  const [user, setUser] = useState({})
  const [chats, setChats] = useState({})
  const [messages, setMessages] = useState({})
  const [message, setMessage] = useState('')
  const [shouldUpdate, setShouldUpdate] = useState(true)

  useEffect(() => {
    if (!session) return
    if (!shouldUpdate) return
    async function getUser() {
      const user = await fetch(`/api/user/${session.user.id}`, {
        method: 'GET',
      })
      const res = await user.json()
      if (res) setUser(res)
    }
    async function getChats() {
      const chats = await fetch(`/api/user/chat/getChats/`, {
        method: 'GET',
      })
      const res = await chats.json()
      if (res) setChats(res)
    }
    async function getMessages() {
      if (!currentChatId) return
      const messages = await fetch(`/api/user/chat/${currentChatId}`, {
        method: 'GET',
      })
      const res = await messages.json()
      if (res) setMessages(res)
      setShouldUpdate(false)
    }

    getMessages()
    getUser()
    getChats()
  }, [session, currentChatId, shouldUpdate])

  async function sendMessage() {
    if (!message) return
    const newMessage = await fetch(`/api/user/chat/sendMessage/`, {
      method: 'POST',
      body: JSON.stringify({
        toUserId: currentChatId,
        fromUserId: user.id,
        text: message,
      }),
    })
    const res = await newMessage.json()
    setShouldUpdate(true)
    if (res) setMessages(messages.messages.concat(res))
    setMessage('')
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-5xl">
        <CgSpinner className="animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/')
  }

  if (user && session && user.id) {
    return (
      <>
        <Head>
          <title>Bodyfit - Chat</title>
        </Head>
        <Navbar>
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-row h-full w-full">
              <div className="w-[30rem] bg-base-300 h-full">
                {chats?.chats &&
                  chats.chats.length > 0 &&
                  chats.chats.map((chat) => {
                    return (
                      <div
                        className={`w-96 h-20 p-2 gap-2 m-2 flex flex-row ${
                          chat.id == currentChatId
                            ? 'bg-base-100'
                            : 'bg-base-200'
                        } hover:bg-primary hover:text-white hover:cursor-pointer`}
                        onClick={() => {
                          router.push({
                            pathname: `/dashboard/chat/`,
                            query: { id: chat.id },
                          })
                          setShouldUpdate(true)
                        }}
                        key={`chat-${chat.id}`}
                      >
                        <div className="flex items-center justify-center">
                          <FaUserCircle className="h-16 w-16" />
                        </div>
                        <div className="flex flex-col justify-center w-full">
                          <p className="text-xl font-bold overflow-hidden w-56 truncate">
                            {chat.name}
                          </p>
                          <div className="flex flex-row h-6 items-end justify-between">
                            <p className="text-ellipsis overflow-hidden w-60 truncate">
                              {chat.lastMessage}
                            </p>
                            <p className="font-bold text-sm">
                              {new Date(chat.updatedAt)
                                .toLocaleTimeString('en-GB')
                                .slice(0, -3)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
              {!currentChatId && (
                <div className="flex items-center justify-center w-full">
                  <p>
                    Assim que você iniciar um chat as mensagens irão aparecer
                    aqui!
                  </p>
                </div>
              )}
              {messages?.messages && currentChatId && (
                <div className="flex flex-col p-8 w-full h-full justify-end gap-2">
                  <div className="flex flex-col-reverse h-[80vh] overflow-scroll overflow-x-hidden">
                    {messages.messages.map((message) => {
                      return (
                        <div
                          className={`card p-4 m-2 bg-base-200
                        ${
                          message.fromUser.id == user.id
                            ? 'self-end bg-primary text-white'
                            : 'self-start'
                        }
                      `}
                          key={`message-${message.id}`}
                        >
                          <p className="">{message.text}</p>
                          <p className="font-bold text-sm self-end">
                            {new Date(message.updatedAt)
                              .toLocaleTimeString('en-GB')
                              .slice(0, -3)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <input
                      type="text"
                      className="input input-bordered mr-2 w-full"
                      placeholder="Digite sua mensagem"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => sendMessage()}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Navbar>
      </>
    )
  }
}
