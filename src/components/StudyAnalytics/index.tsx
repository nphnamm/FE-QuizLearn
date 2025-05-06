import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, ChevronDown, Timer } from 'lucide-react';


export interface CompletedCard {
  id: string;
  sessionId: string;
  cardId: string;
  isCorrect: boolean;
  timesAnswered: number;
  answeredAt: string;
  createdAt: string;
  updatedAt: string;
}
export interface StudyAnalyticsProps {
  id: string;
  sessionId: string;
  userId: string;
  setId: string;
  sessionType: string;
  totalCards: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  timeSpent: number;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  allCompletedCards: CompletedCard[];
}

interface Props {
  data: StudyAnalyticsProps;
}


export default function StudyAnalytics({ data }: Props) {
  const [activeTab, setActiveTab] = useState('all');
  const [statistics, setStatistics] = useState();
  const [progress, setProgress] = useState(0);
  const [newCards,setNewCards]= useState(0);
  const [learningCards,setLearningCards]= useState(0 );
  const [almostDoneCards,setAlmostDoneCards]= useState( 0 );
  const [masteredCards,setMasteredCards]= useState(0);


  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'learn', label: 'Learn' },
    { id: 'practice', label: 'Practice Test' },
    { id: 'matching', label: 'Matching' },
    { id: 'spaced', label: 'Spaced Repetition' },
  ];

  const studyCategories = [
    { id: 'new', label: 'New cards', count: newCards, color: 'bg-pink-100 text-pink-600', progressColor: 'bg-pink-600', },
    { id: 'learning', label: 'Still learning', count: learningCards, color: 'bg-purple-100 text-purple-600', progressColor: 'bg-purple-600' },
    { id: 'almost', label: 'Almost done', count:almostDoneCards, color: 'bg-green-200 text-blue-600', progressColor: 'bg-green-200' },
    { id: 'mastered', label: 'Mastered', count: masteredCards, color: 'bg-teal-100 text-teal-600', progressColor: 'bg-teal-600', },
  ];
  useEffect(() => {
    const progress = parseFloat((data?.correctAnswers / data?.totalCards * 100).toFixed(2));
    setProgress(progress);
    const newCards = data?.allCompletedCards?.filter((card) => card.timesAnswered >= 4);
    setNewCards(newCards?.length);

    const learningCards = data?.allCompletedCards?.filter((card) => card.timesAnswered == 2);
    setLearningCards(learningCards?.length);

    const almostDoneCards = data?.allCompletedCards?.filter((card) => card.timesAnswered == 3);
    setAlmostDoneCards(almostDoneCards?.length);

    const masterCards = data?.allCompletedCards?.filter((card) => card.timesAnswered == 1);
    setMasteredCards(masterCards?.length);

  }, [])
  console.log('newCards', newCards);
  console.log('learningCards', learningCards);
  console.log('almostDoneCards', almostDoneCards);
  console.log('masteredCards', masteredCards);

  return (
    <Card className="mt-4 mx-auto">
      {/* Study Analytics Header */}
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl">Study Analytics</CardTitle>
      </CardHeader>

      {/* Study Mode Tabs */}
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="avagrid grid-cols-5 gap-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-full data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>

      {/* Study Stats Section */}
      {/* <CardContent className="px-6 pt-0">
        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex gap-14 overflow-x-auto">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-medium text-gray-800">Mastery</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-medium text-gray-800">Learn</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-medium text-gray-800">Test</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-medium text-gray-800">Matching</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-medium text-gray-800">Spaced</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </CardContent> */}

      {/* Performance Metrics */}
      <CardContent className="flex flex-wrap gap-4">
        <div className="bg-pink-100 text-pink-600 hover:bg-pink-200 px-4 py-2 rounded-full text-sm font-medium">
          {progress} %
        </div>
        <div className="bg-pink-100 text-pink-600 hover:bg-pink-200 px-4 py-2 rounded-full text-sm font-medium flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          1m 54s
        </div>
        <div className="text-gray-600 px-4 py-2 flex items-center text-sm">
          <Timer className="w-4 h-4 mr-1" />
          0 m
        </div>
        <div className="text-gray-600 px-4 py-2 flex items-center text-sm">
          <Timer className="w-4 h-4 mr-1" />
          0 m
        </div>
        <div className="text-gray-600 px-4 py-2 flex items-center text-sm">
          <Timer className="w-4 h-4 mr-1" />
          0 m
        </div>
      </CardContent>

      {/* Progress Section */}
      <CardContent className="pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Studying Progress</h2>
          <div className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-medium">
            {progress} %

          </div>
        </div>

        <Progress value={progress}
          className="h-1 mb-6 bg-gray-100" />

        {/* Study Categories */}
        <div className="space-y-4">
          {studyCategories.map((category) => {
            // Calculate percentage for progress bar (using total of 20 as basis)
            const totalCards = 20;
            const percentage = (category.count / totalCards) * 100;

            return (
              <div key={category.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`${category.color} px-4 py-2 rounded-full flex items-center`}>
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <span className="text-gray-700">{category.count}</span>
                  </div>
                  <Button variant="outline" className="px-6 rounded-full">
                    Study
                  </Button>
                </div>

                {/* Colored progress bar for each category */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${category.progressColor}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}