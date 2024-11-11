"use client"

import { useState, useEffect } from 'react'
import AddAnimal from './components/add_animal'
import AnimalCard from './components/animal'
import { ThemeButton } from './components/theme-button'
import { Toaster } from "@/components/ui/toaster"
import { Button } from '@/components/ui/button' // Import the Button component
import { useToast } from "@/hooks/use-toast"

const BACKEND_URL = 'http://127.0.0.1:5000';

export default function FarmPage() {
  const [animals, setAnimals] = useState([]);
  const [money, setMoney] = useState(0);
  const { toast } = useToast()

  const fetchFarmStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/status`, {
        method: "POST",
      });
      const data = await response.json();
      setAnimals(data.animals);
      setMoney(data.money);
    } catch (error) {
      console.error("Error fetching farm status:", error);
    }
  };

  useEffect(() => {
    fetchFarmStatus();

    const intervalId = setInterval(fetchFarmStatus, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const refreshAnimals = () => {
    fetchFarmStatus();
  };

  const handleAction = async (action) => {
    try {
      const response = await fetch(`${BACKEND_URL}/${action}`, {
        method: 'POST',
      });

      if (response.status === 200 || response.status === 201) { 
        toast({
          title: 'Success',
          description: `${action} successful!`, 
        });
        refreshAnimals(); 
      } else if (response.status === 500) {
        toast({
          title: 'Error',
          description: 'Not enough money', 
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: `Failed to perform ${action}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast({
        title: 'Error',
        description: `Failed to perform ${action}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4 z-10 flex items-center">
        <p className="mr-4 text-lg font-semibold">Money: ${money}</p>
        <ThemeButton />
      </div>
       <header className="p-4 border-b left-4 z-10 flex items-center">
        <h1 className="mr-4 text-2xl font-bold">My Farm</h1>
        <AddAnimal onAnimalAdded={refreshAnimals} />

        <div className="ml-4 flex space-x-2">
          <Button onClick={() => handleAction('feed_animals')} className="rounded-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold">
            Feed Animals
          </Button>

          <Button onClick={() => handleAction('care_for_animals')} className="rounded-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold">
            Care for Animals
          </Button>

          <Button onClick={() => handleAction('api/collect_products')} className="rounded-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold">
            Collect Products
          </Button>
        </div>
      </header>
      <main className="p-4">
        <Toaster />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {animals.map((animal, index) => (
            <AnimalCard key={index} {...animal} /> 
          ))}
        </div>
      </main>
    </div>
  )
}