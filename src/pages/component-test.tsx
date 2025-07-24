import { useState, useEffect } from 'react';
import { TimeInput } from '@/components/ui/form/TimeInput';
import { Input } from '@/components/ui/form/Input';
import { Select } from '@/components/ui/form/Select';
import { SearchInput } from '@/components/ui/form/SearchInput';
import { CheckboxGroup } from '@/components/ui/form/CheckboxGroup';
import { RadioGroup } from '@/components/ui/form/RadioGroup';
import { Switch } from '@/components/ui/form/Switch';
import { RangeSlider } from '@/components/ui/form/RangeSlider';
import { DatePicker } from '@/components/ui/form/DatePicker';
import { FileUpload } from '@/components/ui/form/FileUpload';
import { useExerciseStore } from '@/store/exerciseStore';
import { timeToSeconds } from '@/lib/utils/timeFormat';

export function ComponentTest() {
  // Get data from Zustand store
  const { 
    exercises, 
    categories: storeCategories, 
    fetchExercises, 
    fetchCategories
  } = useExerciseStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchExercises();
    fetchCategories();
  }, [fetchExercises, fetchCategories]);

  // Test state for each component - use real data from store
  const [timeValue, setTimeValue] = useState(exercises[0]?.standard_time || '1:00');
  const [nameValue, setNameValue] = useState(exercises[0]?.exercise_name || 'Exercise Name');
  const [categoryValue, setCategoryValue] = useState(exercises[0]?.category_id || '');
  
  // Extract categories, tags, etc from real data
  const categoryOptions = storeCategories.map(cat => ({
    label: cat.name,
    value: cat.id
  }));
  
  const allTags = [...new Set(exercises.flatMap(ex => ex.template_tags || []))];
  const tagOptions = allTags.map(tag => ({
    label: tag,
    value: tag
  }));
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Position data from schema
  const positions = ["plank", "side-lying", "kneeling", "standing", "seated"];
  const positionOptions = positions.map(pos => ({
    label: pos.charAt(0).toUpperCase() + pos.slice(1),
    value: pos
  }));
  
  const [position, setPosition] = useState(positions[0]);
  
  // Range data (difficulty level, etc)
  const [rangeValue, setRangeValue] = useState(3);
  
  // Search data
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  
  // Switch data
  const [isActive, setIsActive] = useState(true);
  
  // Date data
  const [dateValue, setDateValue] = useState(new Date());
  
  // Helper for search
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = exercises
      .filter(ex => ex.exercise_name.toLowerCase().includes(value.toLowerCase()))
      .map(ex => ex.exercise_name);
    
    setSearchResults(results);
  };

  // Update component state when exercises data loads
  useEffect(() => {
    if (exercises.length > 0) {
      setTimeValue(exercises[0].standard_time || '1:00');
      setNameValue(exercises[0].exercise_name || 'Exercise Name');
      setCategoryValue(exercises[0].category_id || '');
    }
  }, [exercises]);

  // Log all outputs to console for testing
  const logOutput = (component: string, value: any) => {
    console.log(`${component} Output:`, value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Component Test Page</h1>
      <p className="text-gray-500">
        This page demonstrates all form components with real data from the Zustand store.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Time Input */}
        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">Time Input</h2>
          <div className="space-y-2">
            <TimeInput
              label="Exercise Time"
              value={timeValue}
              onChange={(value) => {
                setTimeValue(value);
                logOutput('TimeInput', value);
              }}
              helperText="Format: MM:SS"
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Time in seconds: {timeToSeconds(timeValue)}</p>
            </div>
          </div>
        </section>

        {/* Text Input */}
        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">Text Input</h2>
          <div className="space-y-2">
            <Input
              label="Exercise Name"
              value={nameValue}
              onChange={(e) => {
                setNameValue(e.target.value);
                logOutput('Input', e.target.value);
              }}
              helperText="Enter the name of the exercise"
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Character count: {nameValue.length}</p>
            </div>
          </div>
        </section>

        {/* Select */}
        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">Select</h2>
          <div className="space-y-2">
            <Select
              label="Category"
              options={categoryOptions}
              value={categoryValue}
              onChange={(e) => {
                setCategoryValue(e.target.value);
                logOutput('Select', e.target.value);
              }}
              placeholder="Select a category"
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Selected from real categories: {categoryValue}</p>
              <p>Matching exercises: {exercises.filter(ex => ex.category_id === categoryValue).length}</p>
            </div>
          </div>
        </section>

        {/* Search Input */}
        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">Search Input</h2>
          <div className="space-y-2">
            <SearchInput
              label="Search Exercises"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                handleSearch(e.target.value);
              }}
              helperText="Search for exercises by name"
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Results: {searchResults.length}</p>
              <ul className="list-disc pl-5 mt-2">
                {searchResults.slice(0, 3).map((result, i) => (
                  <li key={i}>{result}</li>
                ))}
                {searchResults.length > 3 && <li>...</li>}
              </ul>
            </div>
          </div>
        </section>

        {/* Checkbox Group */}
        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">Checkbox Group</h2>
          <div className="space-y-2">
            <CheckboxGroup
              name="tags"
              label="Tags"
              options={tagOptions}
              value={selectedTags}
              onChange={(values) => {
                setSelectedTags(values.map(v => String(v)));
                logOutput('CheckboxGroup', values);
              }}
              helperText="Select applicable tags"
              orientation="horizontal"
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Selected tags: {selectedTags.join(', ') || 'None'}</p>
            </div>
          </div>
        </section>

        {/* Radio Group */}
        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">Radio Group</h2>
          <div className="space-y-2">
            <RadioGroup
              name="position"
              label="Position"
              options={positionOptions}
              value={position}
              onChange={(value) => {
                setPosition(String(value));
                logOutput('RadioGroup', value);
              }}
              helperText="Select the exercise position"
              orientation="horizontal"
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Selected position: {position}</p>
              <p>Matching exercises: {exercises.filter(ex => 
                (ex.setup_instructions || '').toLowerCase().includes(position)
              ).length}</p>
            </div>
          </div>
        </section>

        {/* Range Slider */}
        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">Range Slider</h2>
          <div className="space-y-2">
            <RangeSlider
              label="Difficulty Level"
              value={rangeValue}
              min={1}
              max={5}
              step={1}
              onChange={(value) => {
                setRangeValue(value);
                logOutput('RangeSlider', value);
              }}
              helperText="Adjust the difficulty level"
              showValue
              formatValue={(value) => {
                const labels = ['Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];
                return labels[value - 1] || `Level ${value}`;
              }}
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Selected level: {rangeValue}</p>
            </div>
          </div>
        </section>

        {/* Switch */}
        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">Switch</h2>
          <div className="space-y-2">
            <Switch
              label="Active Status"
              checked={isActive}
              onChange={(checked) => {
                setIsActive(checked);
                logOutput('Switch', checked);
              }}
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </section>

        {/* Date Picker */}
        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">Date Picker</h2>
          <div className="space-y-2">
            <DatePicker
              label="Schedule Date"
              value={dateValue}
              onChange={(date) => {
                if (date) {
                  setDateValue(date);
                  logOutput('DatePicker', date);
                }
              }}
              helperText="Select a date for the exercise"
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Selected date: {dateValue.toLocaleDateString()}</p>
            </div>
          </div>
        </section>

        {/* File Upload */}
        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">File Upload</h2>
          <div className="space-y-2">
            <FileUpload
              label="Exercise Image"
              onFileSelect={(files) => {
                logOutput('FileUpload', files);
              }}
              helperText="Upload an image for the exercise"
              accept="image/*"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
