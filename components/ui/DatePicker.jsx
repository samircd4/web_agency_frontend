import React, { useState, useRef, useEffect } from 'react';
import { format, parse, isValid, toDate } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Default styles, we'll override with Tailwind

const DatePicker = ({ value, onChange, placeholder = "Select a date", className = "" }) => {
    const [selected, setSelected] = useState(value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined);
    const [inputValue, setInputValue] = useState(value || '');
    const [isPopperOpen, setIsPopperOpen] = useState(false);
    const popperRef = useRef(null);
    const buttonRef = useRef(null);

    const formatInputValue = (date) => (date ? format(date, 'yyyy-MM-dd') : '');

    useEffect(() => {
        if (value) {
            const date = parse(value, 'yyyy-MM-dd', new Date());
            setSelected(isValid(date) ? date : undefined);
            setInputValue(value);
        } else {
            setSelected(undefined);
            setInputValue('');
        }
    }, [value]);

    const handleDaySelect = (date) => {
        setSelected(date);
        const formattedDate = formatInputValue(date);
        setInputValue(formattedDate);
        onChange(formattedDate);
        setIsPopperOpen(false);
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputValue(text);
        const date = parse(text, 'yyyy-MM-dd', new Date());
        if (isValid(date)) {
            setSelected(date);
            onChange(formatInputValue(date));
        } else {
            setSelected(undefined);
            onChange('');
        }
    };

    const handleInputBlur = () => {
        const date = parse(inputValue, 'yyyy-MM-dd', new Date());
        if (!isValid(date) && inputValue !== '') {
            // If invalid date and not empty, reset to previous valid state or clear
            if (selected) {
                setInputValue(formatInputValue(selected));
                onChange(formatInputValue(selected));
            } else {
                setInputValue('');
                onChange('');
            }
        } else if (isValid(date) && inputValue !== formatInputValue(selected)) {
            // If valid date but input value changed (e.g., user typed in a valid date directly) and not the same as selected
            setSelected(date);
            onChange(formatInputValue(date));
        }
    };

    const handleButtonClick = () => {
        setIsPopperOpen(!isPopperOpen);
    };

    // Close popper when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popperRef.current &&
                !popperRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsPopperOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="relative">
            <input
                type="text" // Use text type to allow custom formatting and prevent native date picker
                ref={buttonRef} // Attach ref to input for click detection
                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/10 font-mono font-bold ${className}`}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsPopperOpen(true)}
                onBlur={handleInputBlur}
            />
            {isPopperOpen && (
                <div ref={popperRef} className="absolute z-50 mt-2 bg-surface-900 border border-white/10 rounded-xl shadow-lg p-3">
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={handleDaySelect}
                        showOutsideDays
                        fixedWeeks
                        className="react-day-picker-custom" // Custom class for Tailwind overrides
                        classNames={{
                            // Override react-day-picker's default styles with Tailwind
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4",
                            month: "space-y-4",
                            caption: "flex justify-center py-2 relative items-center",
                            caption_label: "text-sm font-medium text-white",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-text-muted rounded-md w-9 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-brand-teal/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white",
                            day_selected: "rounded-md bg-brand-teal text-white hover:bg-brand-teal hover:text-white focus:bg-brand-teal focus:text-white",
                            day_today: "text-brand-teal",
                            day_outside: "text-text-dim opacity-50",
                            day_disabled: "text-text-dim opacity-50",
                            day_range_middle: "aria-selected:bg-brand-teal/20 aria-selected:text-white",
                            day_hidden: "invisible",
                            // Added classes for hover/focus states to match theme
                            day_hover: "hover:bg-white/10 rounded-md",
                            day_focus: "focus:bg-white/10 rounded-md",
                        }}
                    />
                </div>
            )}
        </div>
    );
};