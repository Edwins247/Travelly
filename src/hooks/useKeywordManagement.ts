import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { PlaceFormValues } from '@/types/contribute';

interface UseKeywordManagementProps {
  setValue: UseFormSetValue<PlaceFormValues>;
  watch: UseFormWatch<PlaceFormValues>;
}

export function useKeywordManagement({ setValue, watch }: UseKeywordManagementProps) {
  const selectedKeywords = watch('keywords');
  const customKeyword = watch('customKeyword');

  const toggleKeyword = (keyword: string) => {
    const newKeywords = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter(k => k !== keyword)
      : [...selectedKeywords, keyword];
    setValue('keywords', newKeywords);
  };

  const addCustomKeyword = () => {
    if (customKeyword.trim() && !selectedKeywords.includes(customKeyword.trim())) {
      setValue('keywords', [...selectedKeywords, customKeyword.trim()]);
      setValue('customKeyword', '');
    }
  };

  return {
    selectedKeywords,
    customKeyword,
    toggleKeyword,
    addCustomKeyword
  };
}
