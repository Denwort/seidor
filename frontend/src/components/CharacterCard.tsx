import React from 'react';
import type { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  children?: React.ReactNode;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  children
}) => {

  return (
    <div className="character-card">
      <div className="character-card-header">
        <h3>{character.name}</h3>
      </div>
      
      <div className="character-details">
        <p><strong>Altura:</strong> {character.height} cm</p>
        <p><strong>Peso:</strong> {character.mass} kg</p>
        <p><strong>Cabello:</strong> {character.hairColor}</p>
        <p><strong>Ojos:</strong> {character.eyeColor}</p>
        <p><strong>Nacimiento:</strong> {character.birthYear}</p>
        <p><strong>Género:</strong> {character.gender}</p>
      </div>

      {children && (
        <div className="character-card-children">
          {children}
        </div>
      )}
    </div>
  );
};
