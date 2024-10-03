{/* New Tabs */
    Years.map(year => (
        <button
          className={`py-2 px-4 text-lg font-medium ${subTab === year ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'}`}
          onClick={() => handleSubTabChange(year)}
        >
          {year} year
          {sections.map(section=>(
            <div>
              <button
              className={`py-2 px-4 text-lg font-medium ${subSections === section ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'}`}
              onClick={() => handleSubSectionChange(section)}
              >
              {section}
              </button>
            </div>
          ))}
        </button>
       ))}