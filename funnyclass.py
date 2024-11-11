import random

class Animal:
    def __init__(self, name, age, health, hunger):
        self.name = name
        self.age = age
        self.health = health
        self.hunger = hunger

    def eat(self):
        self.hunger = min(100, self.hunger + 10)
        self.health = min(100, self.health + 5)

    def sleep(self):
        self.health = min(100, self.health + 10)

    def play(self):
        self.hunger = max(0, self.hunger - 10)
        self.health = min(100, self.health + 5)

    def status(self):
        return {
            "name": self.name,
            "age": self.age,
            "health": self.health,
            "hunger": self.hunger,
            "animal_type": self.__class__.__name__.lower()
        }

class Cow(Animal):
    def __init__(self, name, age, health, hunger, milk):
        super().__init__(name, age, health, hunger)
        self.milk = milk

    def give_milk(self):
        if self.hunger <= 0:
           raise ValueError("Not enough hunger!")
        else:
            self.hunger = max(0, self.hunger - 5)
            self.milk += 1

    def status(self):
        data = super().status()
        data["milk"] = self.milk
        return data

class Pig(Animal):
    def __init__(self, name, age, health, hunger, dirtiness):
        super().__init__(name, age, health,hunger)
        self.dirtiness = dirtiness

    def clean(self):
        if self.hunger <= 0:
           raise ValueError("Not enough hunger!")
        else:
            self.hunger = max(0, self.hunger - 10)
            self.dirtiness = 0
            self.health = max(100, self.health + 5)

    def status(self):
        data = super().status()
        data["dirtiness"] = self.dirtiness
        return data

class Chicken(Animal):
    def __init__(self, name, age=0, health=100, hunger=100, eggs=0):
        super().__init__(name, age, health, hunger)
        self.eggs = eggs

    def lay_eggs(self):
        if self.hunger <= 0:
           raise ValueError("Not enough hunger!")
        else:
            self.hunger = max(0, self.hunger - 5)
            self.eggs += 1

    def status(self):
        data = super().status()
        data["eggs"] = self.eggs
        return data

class Farm:
    def __init__(self, initial_money=100): 
        self.animals = []
        self.money = initial_money

    def add_animal(self, animal):
        if self.money >= 50:
            self.animals.append(animal)
            self.money -= 50  
        else:
            raise ValueError("Not enough money to buy animal!")

    def feed_animals(self):
        feeding_cost = len(self.animals) * 5
        if self.money >= feeding_cost:
            for animal in self.animals:
                animal.eat()
            self.money -= feeding_cost
        else:
            raise ValueError("Not enough money to feed all animals!")

    def care_for_animals(self):
        cleaning_cost = 0
        for animal in self.animals:
            if isinstance(animal, Pig):
                cleaning_cost += 5
                animal.clean()
            animal.sleep()

        if self.money >= cleaning_cost:
            self.money -= cleaning_cost
        else:
            raise ValueError("Not enough money to care for all animals!")


    def remove_animal(self, animal):
        if animal in self.animals:
            self.animals.remove(animal)

    def collect_products(self):
        milk = 0
        eggs = 0
        for animal in self.animals:
            if isinstance(animal, Cow):
                milk += animal.milk
                animal.milk = 0
            elif isinstance(animal, Chicken):
                eggs += animal.eggs
                animal.eggs = 0

        self.money += eggs * 3  
        self.money += milk * 5 

        return {"milk": milk, "eggs": eggs}

    def status(self):
        for animal in self.animals:
            if isinstance(animal, Cow) and random.random() < 0.5:
                animal.give_milk() 
            elif isinstance(animal, Chicken) and random.random() < 0.5:
                animal.lay_eggs()

        return {
            "animals": [animal.status() for animal in self.animals],
            "money": self.money
    }