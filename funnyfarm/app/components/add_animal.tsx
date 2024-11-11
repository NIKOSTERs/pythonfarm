'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast"

const animalOptions = [
  { value: 'cow', label: 'Cow' },
  { value: 'pig', label: 'Pig' },
  { value: 'chicken', label: 'Chicken' },
];

export default function AddAnimal({ onAnimalAdded }) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false);
  const [animalType, setAnimalType] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [health, setHealth] = useState('');
  const [hunger, setHunger] = useState('');
  const [specificValue, setSpecificValue] = useState('');

  const [inputErrors, setInputErrors] = useState({
    animalType: false,
    name: false,
    age: false,
    health: false,
    hunger: false,
    specificValue: false,
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newInputErrors = {
      animalType: !animalType,
      name: !name,
      age: !age,
      health: !health,
      hunger: !hunger,
      specificValue: !animalType || !specificValue,
    };

    setInputErrors(newInputErrors);

    if (Object.values(newInputErrors).some((error) => error)) {
      return;
    }

    const animalData = {
      type: animalType,
      name: name,
      age: parseInt(age), 
      health: parseInt(health), 
      hunger: parseInt(hunger), 
      [animalType === 'cow'
        ? 'milk'
        : animalType === 'chicken'
        ? 'eggs'
        : 'dirtiness']: parseInt(specificValue)
    };

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/create_animal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animalData),
      });

      if (response.status === 201) {
        toast({
          title: 'Success',
          description: `Successfully added animal ${name}`,
        });
        if (onAnimalAdded) {
            onAnimalAdded();
        };
      } else if (response.status === 500) {
        toast({
          title: 'Error',
          description: 'Not enough money',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add animal.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding animal:', error);
      toast({
        title: 'Error',
        description: 'Failed to add animal.',
        variant: 'destructive',
      });
    }

    handleClose();
    setAnimalType('');
    setName('');
    setAge('');
    setHealth('');
    setHunger('');
    setSpecificValue('');
    setInputErrors({
      animalType: false,
      name: false,
      age: false,
      health: false,
      hunger: false,
      specificValue: false,
    });
  };

  return (
    <>
      <Button onClick={handleOpen} className="rounded-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold">Add Animal</Button>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Animal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              onValueChange={setAnimalType}
              value={animalType}
              className={`${inputErrors.animalType ? 'ring-2 ring-red-500' : ''
                }`}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select animal type" />
              </SelectTrigger>
              <SelectContent>
                {animalOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className={`${inputErrors.name ? 'ring-2 ring-red-500' : ''}`}
              />
            </div>
            <div>
              <Input
                id="age"
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                }}
                className={`${inputErrors.age ? 'ring-2 ring-red-500' : ''}`}
              />
            </div>
            <div>
              <Input
                id="health"
                type="number"
                placeholder="Health"
                value={health}
                onChange={(e) => {
                  setHealth(e.target.value);
                }}
                className={`${inputErrors.health ? 'ring-2 ring-red-500' : ''
                  }`}
              />
            </div>
            <div>
              <Input
                id="hunger"
                type="number"
                placeholder="Hunger"
                value={hunger}
                onChange={(e) => {
                  setHunger(e.target.value);
                }}
                className={`${inputErrors.hunger ? 'ring-2 ring-red-500' : ''
                  }`}
              />
            </div>
            <div>
              <Input
                id="specific"
                type="number"
                placeholder={
                  animalType === 'cow'
                    ? 'Milk'
                    : animalType === 'chicken'
                    ? 'Eggs'
                    : 'Dirtiness'
                }
                value={specificValue}
                onChange={(e) => {
                  setSpecificValue(e.target.value);
                }}
                disabled={!animalType}
                className={`${inputErrors.specificValue ? 'ring-2 ring-red-500' : ''
                  }`}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}