import { useNavigate, useSearch } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, MapPin, Globe } from 'lucide-react';

const searchFormSchema = z.object({
  country: z.string().min(2, 'Country code must be at least 2 characters'),
  city: z.string().min(1, 'City is required'),
});

const POPULAR_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
];

const SearchForm = () => {
  const { country, city } = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });

  const form = useForm({
    defaultValues: {
      country: country,
      city: city,
    },
    onSubmit: async ({ value }) => {
      // Navigate to the same route with updated search params
      navigate({
        to: '/',
        search: {
          country: value.country,
          city: value.city,
          page: 1, // Reset to page 1 when searching
        },
      });
    },
  });

  return (
    <div className='bg-gradient-to-b from-blue-50 to-white py-8'>
      <div className='mx-auto px-4 max-w-4xl'>
        <h1 className='mb-6 font-bold text-gray-800 text-3xl text-center'>
          Find Your Perfect Hotel
        </h1>
        <form
          className='bg-white shadow-lg mx-auto p-6 rounded-xl max-w-3xl'
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_2fr_auto]'>
            {/* Country Field */}
            <form.Field
              name='country'
              validators={{
                onChange: ({ value }) => {
                  const result =
                    searchFormSchema.shape.country.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className='flex flex-col gap-2'>
                  <Label
                    className='font-medium text-gray-700 text-sm'
                    htmlFor='country'
                  >
                    <Globe className='inline-block mr-1.5 w-4 h-4' />
                    Country
                  </Label>
                  <select
                    id='country'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className='px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    {POPULAR_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors.length > 0 && (
                    <span className='text-red-500 text-xs'>
                      {field.state.meta.errors.join(', ')}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            {/* City Field */}
            <form.Field
              name='city'
              validators={{
                onChange: ({ value }) => {
                  const result = searchFormSchema.shape.city.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className='flex flex-col gap-2'>
                  <Label
                    className='font-medium text-gray-700 text-sm'
                    htmlFor='city'
                  >
                    <MapPin className='inline-block mr-1.5 w-4 h-4' />
                    City
                  </Label>
                  <Input
                    type='text'
                    id='city'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='e.g., New York, Paris, Tokyo'
                    className='focus:ring-2 focus:ring-blue-500'
                  />
                  {field.state.meta.errors.length > 0 && (
                    <span className='text-red-500 text-xs'>
                      {field.state.meta.errors.join(', ')}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            {/* Submit Button */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  className='gap-2 bg-blue-600 hover:bg-blue-700 md:mt-7 h-10'
                  variant='default'
                  type='submit'
                  disabled={!canSubmit}
                >
                  <Search className='w-4 h-4' />
                  {isSubmitting ? 'Searching...' : 'Search'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
