
import { Card, CardContent } from "@/components/ui/card";

const StatCards = () => {
  const stats = [
    {
      title: "Net Income",
      value: "$250,000.00",
      bgColor: "bg-slate-700",
    },
    {
      title: "Number of New Clients",
      value: "36",
      bgColor: "bg-slate-700",
    },
    {
      title: "Number of Completed Projects",
      value: "29",
      bgColor: "bg-slate-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} text-white border-slate-600`}>
          <CardContent className="p-4">
            <p className="text-xs text-slate-300 mb-1">{stat.title}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatCards;
