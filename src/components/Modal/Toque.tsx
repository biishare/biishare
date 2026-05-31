'use client'



import {

  AnimatePresence,

  motion,

  useAnimation,

  PanInfo,

} from 'framer-motion'



import {

  Box,

  IconButton,

} from '@mui/material'



import {

  ChevronUp,

  ChevronDown,

  X,

} from 'lucide-react'



import {

  useRouter,

} from 'next/navigation'



import {

  useEffect,

  useState,

} from 'react'



import { Toque } from '../../../types/Toque'

import { ToquesCard } from '@/components/Toque/Toques'



interface Props {

  open: boolean

  items: Toque[]



  selectedIndex?: number | null

  onChangeIndex?: (

    index: number

  ) => void



  useRouterNav?: boolean



  onClose: () => void

}



export default function ReelModal({

  open,

  items,

  selectedIndex,

  onChangeIndex,

  useRouterNav = false,

  onClose,

}: Props) {

  const router = useRouter()



  const controls = useAnimation()



  const index =

    selectedIndex ?? 0



  const item = items[index]



  const isFirst =

    index <= 0



  const isLast =

    index >=

    items.length - 1



  const [direction, setDirection] =

    useState(0)






  /**

   * NAVIGATION

   */



  const next = () => {

    if (isLast) return



    setDirection(1)



    const nextIndex =

      index + 1



    if (useRouterNav) {

      const nextItem =

        items[nextIndex]



      if (!nextItem) return



      router.replace(

        `/toque/${nextItem._id}`

      )

    } else {

      onChangeIndex?.(

        nextIndex

      )

    }

  }



  const prev = () => {

    if (isFirst) return



    setDirection(-1)



    const prevIndex =

      index - 1



    if (useRouterNav) {

      const prevItem =

        items[prevIndex]



      if (!prevItem) return



      router.replace(

        `/toque/${prevItem._id}`

      )

    } else {

      onChangeIndex?.(

        prevIndex

      )

    }

  }



  /**

   * CLOSE

   */



  const handleClose = () => {

    onClose()



    if (useRouterNav) {

      router.back()

    }

  }



  /**

   * DRAG

   */



  const handleDragEnd = async (

    _: MouseEvent | TouchEvent | PointerEvent,

    info: PanInfo

  ) => {

    const y =

      info.offset.y



    const velocity =

      info.velocity.y



    /**

     * SWIPE UP

     * próximo

     */

    if (

      y < -120 ||

      velocity < -800

    ) {

      if (!isLast) {

        next()

        return

      }

    }



    /**

     * SWIPE DOWN

     * anterior

     */

    if (

      y > 120 ||

      velocity > 800

    ) {

      if (!isFirst) {

        prev()

        return

      }

    }



    /**

     * bounce back

     */

    await controls.start({

      y: 0,

      transition: {

        duration: 0.18,

      },

    })

  }



  /**

   * KEYBOARD

   */



  useEffect(() => {

    const handler = (

      e: KeyboardEvent

    ) => {

      switch (e.key) {

        case 'ArrowDown':

          if (!isLast)

            next()

          break



        case 'ArrowUp':

          if (!isFirst)

            prev()

          break



        case 'Escape':

          handleClose()

          break

      }

    }



    window.addEventListener(

      'keydown',

      handler

    )



    return () =>

      window.removeEventListener(

        'keydown',

        handler

      )

  }, [

    index,

    isFirst,

    isLast,

  ])



  /**

   * LOCK BODY SCROLL

   */



  useEffect(() => {

    document.body.style.overflow =

      'hidden'



    return () => {

      document.body.style.overflow =

        ''

    }

  }, [])



  /**

   * RESET POSITION

   */



  useEffect(() => {

    controls.set({

      y: 0,

      opacity: 1,

      scale: 1,

    })

  }, [

    item._id,

    controls,

  ])



  useEffect(() => {

    controls.start({

      opacity: 1,

      scale: 1,

      y: 0,

      transition: {

        duration: 0.25,

      },

    })

  }, [item._id])


  if (!item) return null


  return (

    <AnimatePresence>

      {open && (

        <motion.div

          initial={{

            opacity: 0,

          }}

          animate={{

            opacity: 1,

          }}

          exit={{

            opacity: 0,

          }}

          style={{

            position:

              'fixed',

            inset: 0,

            zIndex: 9999,

            display:

              'flex',

            alignItems:

              'center',

            justifyContent:

              'center',

            background:

              item.mediaType ===

                'image'

                ? `url(${item.imageUrl}) center/cover`

                : '#000',

          }}

        >

          {/* Blur */}

          <Box

            sx={{

              position:

                'absolute',

              inset: 0,

              backdropFilter:

                'blur(30px)',

              background:

                'rgba(0,0,0,.35)',

            }}

          />



          <AnimatePresence

            mode="wait"

            initial={false}

          >

            <motion.div

              key={item._id}

              drag="y"

              dragElastic={

                0.12

              }

              animate={

                controls

              }

              onDragEnd={

                handleDragEnd

              }

              initial={{

                opacity: 0,

                scale: 0.98,

                y:

                  direction > 0

                    ? 120

                    : -120,

              }}

              exit={{

                opacity: 0,

                scale: 0.98,

                y:

                  direction > 0

                    ? -120

                    : 120,

              }}

              transition={{

                duration:

                  0.25,

                ease:

                  'easeOut',

              }}

              style={{

                width:

                  '100%',

                height:

                  '100%',

                display:

                  'flex',

                alignItems:

                  'center',

                justifyContent:

                  'center',

                position:

                  'relative',

                zIndex: 1,

              }}

            >

              {/* CLOSE */}

              <IconButton

                onClick={

                  handleClose

                }

                sx={{

                  position:

                    'absolute',

                  top: 12,

                  right: 12,

                  zIndex: 5,

                  color:

                    '#fff',

                  bgcolor:

                    'rgba(0,0,0,.45)',



                  '&:hover':

                  {

                    bgcolor:

                      'rgba(0,0,0,.65)',

                  },

                }}

              >

                <X size={18} />

              </IconButton>



              {/* CARD */}

              <ToquesCard

                item={item}

                pageToque

                sx={{

                  width:

                    '100%',

                  height:

                    '100%',

                  maxWidth:

                    520,

                  background:

                    '#000',

                }}

              />



              {/* DESKTOP NAV */}

              <Box

                sx={{

                  position:

                    'absolute',

                  right: 16,

                  top: '50%',

                  transform:

                    'translateY(-50%)',



                  display: {

                    xs: 'none',

                    md: 'flex',

                  },



                  flexDirection:

                    'column',



                  gap: 2,

                }}

              >

                <IconButton

                  onClick={

                    prev

                  }

                  disabled={

                    isFirst

                  }

                  sx={{

                    color:

                      '#fff',

                    bgcolor:

                      'rgba(0,0,0,.45)',

                  }}

                >

                  <ChevronUp />

                </IconButton>



                <IconButton

                  onClick={

                    next

                  }

                  disabled={

                    isLast

                  }

                  sx={{

                    color:

                      '#fff',

                    bgcolor:

                      'rgba(0,0,0,.45)',

                  }}

                >

                  <ChevronDown />

                </IconButton>

              </Box>

            </motion.div>

          </AnimatePresence>

        </motion.div>

      )}

    </AnimatePresence>

  )

}