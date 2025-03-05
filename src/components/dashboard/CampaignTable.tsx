interface Campaign {
  id: string;
  name: string;
  spend: number;
  sales: number;
  acos: number;
}

const campaignData: Campaign[] = [
  {
    id: "1",
    name: "ROBINY9N3MT",
    spend: 30.25,
    sales: 149.85,
    acos: 20.19
  },
  {
    id: "2",
    name: "Campaign - 3...",
    spend: 40.00,
    sales: 134.50,
    acos: 29.74
  },
  {
    id: "3",
    name: "Research - AC...",
    spend: 43.55,
    sales: 125.00,
    acos: 34.84
  },
  {
    id: "4",
    name: "B087C75QQJ",
    spend: 45.85,
    sales: 119.45,
    acos: 38.38
  },
  {
    id: "5",
    name: "House Numbe...",
    spend: 54.00,
    sales: 85.00,
    acos: 63.53
  }
];

export function CampaignTable() {
  return (
    <div className="space-y-3 dark">
      {campaignData.map((campaign) => (
        <div
          key={campaign.id}
          className="flex items-center justify-between p-2 rounded-lg bg-[#3a3a3a]/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-sm text-white">{campaign.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Spend</div>
              <div className="text-sm text-white">${campaign.spend.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Sales</div>
              <div className="text-sm text-white">${campaign.sales.toFixed(2)}</div>
            </div>
            <div className="text-right min-w-[60px]">
              <div className="text-sm text-gray-400">ACoS</div>
              <div className="text-sm text-red-400">{campaign.acos.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 