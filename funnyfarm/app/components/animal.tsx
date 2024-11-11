import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AnimalProps = {
  animal_type: 'cow' | 'pig' | 'chicken'
  name: string
  age: number
  health: number
  hunger: number
  milk?: number
  dirtiness?: number
  eggs?: number
}

type SpecificData = {
  label: string;
  value: number | string | undefined; 
};

const animalEmojis = {
  cow: '🐮',
  pig: '🐷',
  chicken: '🐔'
}

export default function AnimalCard({
  animal_type,
  name,
  age,
  health,
  hunger,
  milk,
  dirtiness,
  eggs
}: AnimalProps) {

  const getSpecificData = (): SpecificData => {
    switch (animal_type) {
      case 'cow':
        return { label: 'Milk', value: milk };
      case 'pig':
        return { label: 'Dirtiness', value: dirtiness };
      case 'chicken':
        return { label: 'Eggs', value: eggs };
      default: 
        return { label: 'Unknown', value: 'N/A' };
    }
  }

  const specificData = getSpecificData();

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center">
        <div className="text-6xl mb-2" role="img" aria-label={`${animal_type} emoji`}>
          {animalEmojis[animal_type]}
        </div>
        <CardTitle className="text-2xl font-bold">
          {name} <span className="text-muted-foreground ml-2 text-lg">({age} years)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-semibold">Health</p>
            <p className="text-lg">{health}</p>
          </div>
          <div>
            <p className="font-semibold">Hunger</p>
            <p className="text-lg">{hunger}</p>
          </div>
          <div>
            <p className="font-semibold">{specificData.label}</p>
            <p className="text-lg">{specificData.value}</p> 
          </div>
        </div>
      </CardContent>
    </Card>
  );
}