'use client'

import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Paper,
} from '@mui/material'

const gradients = [
  'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
  'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
]

const FlipCard = ({ front, back, index }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    setIsFlipped(!isFlipped)
  }

  const frontGradient = gradients[index % gradients.length]
  const backGradient = gradients[(index + 1) % gradients.length]

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: '100%',
        height: 300,
        perspective: '1000px',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'transform 0.3s ease-in-out',
        },
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
            background: frontGradient,
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
            background: backGradient,
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

export default function Generate() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#4a90e2' }}>
          Flashcard Generator
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text to generate flashcards"
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          size="large"
          disabled={isLoading}
          sx={{ py: 1.5, fontSize: '1.1rem' }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Flashcards'}
        </Button>
      </Box>
      
      {flashcards.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#4a90e2' }}>
            Your Flashcards
          </Typography>
          <Grid container spacing={4}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FlipCard front={flashcard.front} back={flashcard.back} index={index} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  )
}