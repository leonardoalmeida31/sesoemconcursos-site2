// AdCard.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button'; // Importe o componente Button

function AdCard({ title, description, imageUrl }) {
  return (
    <Card>
      
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        
      </CardContent>
    </Card>
  );
}

export default AdCard;
