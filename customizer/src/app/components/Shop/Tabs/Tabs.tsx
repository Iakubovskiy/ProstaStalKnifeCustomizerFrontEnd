interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface ShopTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const ShopTabs: React.FC<ShopTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <nav className="flex space-x-8 px-4 max-w-7xl mx-auto" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${
                activeTab === tab.id
                  ? "border-[#d8a878] text-[#816b4b]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`
                  ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full
                  ${
                    activeTab === tab.id
                      ? "bg-[#f5ede2] text-[#816b4b]"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ShopTabs;
