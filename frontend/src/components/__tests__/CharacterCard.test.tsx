/**
 * Tests for CharacterCard component
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CharacterCard } from '../CharacterCard';
import type { Character } from '../../types';

describe('CharacterCard', () => {
  const mockCharacter: Character = {
    id: '1',
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hairColor: 'blond',
    skinColor: 'fair',
    eyeColor: 'blue',
    birthYear: '19BBY',
    gender: 'male'
  };

  it('should render character name', () => {
    render(<CharacterCard character={mockCharacter} />);
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
  });

  it('should render character details', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByText('172 cm')).toBeInTheDocument();
    expect(screen.getByText('77 kg')).toBeInTheDocument();
    expect(screen.getByText('blond')).toBeInTheDocument();
    expect(screen.getByText('blue')).toBeInTheDocument();
    expect(screen.getByText('19BBY')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    render(
      <CharacterCard character={mockCharacter}>
        <button>Remove</button>
      </CharacterCard>
    );
    
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

});
