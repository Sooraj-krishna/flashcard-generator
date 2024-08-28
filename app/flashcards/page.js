'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Container, Grid, Typography, Box, Paper } from '@mui/material'
import { collection, doc, getDoc } from 'firebase/firestore'
import db from '../../lib/firebase'

const FlipCard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: '100%',
        height: 200,
        perspective: '1000px',
        cursor: 'pointer',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            color: '#333',
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Question:
          </Typography>
          <Typography textAlign="center">{front}</Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
            color: '#333',
            transform: 'rotateY(180deg)',
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Answer:
          </Typography>
          <Typography textAlign="center">{back}</Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const userData = docSnap.data()
        // Assuming the flashcards are stored in a 'flashcards' field
        setFlashcards(userData.flashcards || [])
      }
    }
    getFlashcards()
  }, [user])

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Your Flashcards
      </Typography>
      <Grid container spacing={3}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FlipCard front={flashcard.front} back={flashcard.back} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}