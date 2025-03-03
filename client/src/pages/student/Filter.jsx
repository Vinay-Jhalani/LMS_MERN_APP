import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FilterIcon } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "datascience", label: "Data Science" },
  { id: "fullstackdevelopment", label: "Fullstack Development" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "webdevelopment", label: "Web Development" },
  { id: "artificialintelligence", label: "Artifical Intelligence" },
  { id: "cloudcomputing", label: "Cloud Computing" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "mobiledevelopment", label: "Mobile Development" },
  { id: "react", label: "React" },
  { id: "nodejs", label: "Node Js" },
  { id: "devops", label: "DevOps" },
  { id: "blockchain", label: "Blockchain" },
  { id: "typescript", label: "TypeScript" },
  { id: "other", label: "Others" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];

      handleFilterChange(newCategories, sortByPrice);
      return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  };
  return (
    <div className="w-full md:w-[20%]">
      <Accordion type="single" collapsible defaultValue="filter">
        <AccordionItem value="filter">
          <AccordionTrigger className="font-bold">
            <span className="flex items-center space-x-2">
              <FilterIcon className="w-5 h-5" />{" "}
              {/* Filter Icon (No rotation applied) */}
              <span>FILTER OPTIONS</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between">
              <Select
                className="focus:ring-2 focus:ring-blue-500 border border-gray-300"
                onValueChange={selectByPriceHandler}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort by price</SelectLabel>
                    <SelectItem value="low">Low to High</SelectItem>
                    <SelectItem value="high">High to Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Separator className="mt-4" />
            <div>
              <Accordion type="single" collapsible defaultValue="category">
                <AccordionItem value="category">
                  <AccordionTrigger className="font-bold">
                    CATEGORY
                  </AccordionTrigger>
                  <AccordionContent>
                    {categories.map((category) => (
                      <div
                        className="flex items-center space-x-2 my-2"
                        key={category.id}
                      >
                        <Checkbox
                          id={category.id}
                          onCheckedChange={() =>
                            handleCategoryChange(category.id)
                          }
                        />
                        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;
