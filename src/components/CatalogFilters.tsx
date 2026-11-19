import { money } from '../data/products';
import { sustainabilityGroups } from '../data/hito3';
import { categorySlug } from '../data/categories';
import { filterOptions, productTypesFor, sorts } from '../data/catalogFilters';
import type { Filters } from '../data/catalogFilters';
import type { ApiCategory } from '../api/client';

const labels = {
  gender: 'Género',
  size: 'Talla',
  colors: 'Colores',
  material: 'Materiales',
};

export function CatalogFilters({ category, categories, draft, change, selectCategory, apply, clear, }: { category: string; categories: ApiCategory[]; draft: Filters; change: (filters: Filters) => void; selectCategory: (category: string) => void; apply: () => void; clear: () => void; }) {

  const productTypes = productTypesFor(category);
  const variants = draft.type ? filterOptions(category, draft.type) : null;

  function replace(key: keyof Filters, value: Filters[keyof Filters]) {

    change({ ...draft, [key]: value });
  }

  function toggle(key: 'attributes' | 'colors', value: string) {

    const values = draft[key];

    replace(
      key,
      values.includes(value)
        ? values.filter((entry) => entry !== value)
        : [...values, value],
    );
  }

  return (
    <form
      className="hito-filters"
      onSubmit={(event) => {

        event.preventDefault();

        apply();
      }}
    >
      <button type="button" className="hito-clear" onClick={clear}>
        Limpiar filtros
      </button>
      <label>
        Categoría
        <select
          value={category}
          onChange={(event) => selectCategory(event.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((entry) => (
            <option key={entry.id} value={categorySlug(entry.name)}>
              {entry.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Tipo de producto
        <select
          value={draft.type}
          disabled={!category}
          onChange={(event) => change({
              ...draft,
              type: event.target.value,
              gender: '',
              size: '',
              colors: [],
              material: '',
            })
          }
        >
          <option value="">
            {category ? 'Todos los tipos' : 'Selecciona una categoría'}
          </option>
          {Array.from(productTypes, ([type, label]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>Disponibilidad</legend>
        <label>
          <input
            type="checkbox"
            checked={draft.available}
            onChange={(event) => replace('available', event.target.checked)}
          />{' '}
          Solo productos disponibles
        </label>
        <label>
          <input
            type="checkbox"
            checked={draft.offers}
            onChange={(event) => replace('offers', event.target.checked)}
          />{' '}
          Solo ofertas
        </label>
      </fieldset>
      <fieldset>
        <legend>Atributos sustentables</legend>
        {Object.entries(sustainabilityGroups).map(([group, attributes]) => (
          <fieldset className="hito-filter-attribute-group" key={group}>
            <legend>{group}</legend>
            {attributes.map((attribute) => (
              <label key={attribute}>
                <input
                  type="checkbox"
                  checked={draft.attributes.includes(attribute)}
                  onChange={() => toggle('attributes', attribute)}
                />
                {attribute}
              </label>
            ))}
          </fieldset>
        ))}
      </fieldset>
      <label>
        Precio máximo
        <output>{money(draft.maxPrice)}</output>
        <input
          type="range"
          min={1000}
          max={80000}
          step={1000}
          value={draft.maxPrice}
          onChange={(event) => replace('maxPrice', event.target.valueAsNumber)}
        />
      </label>
      <label>
        Ordenar por
        <select
          value={draft.sort}
          onChange={(event) => replace('sort', event.target.value)}
        >
          {Object.entries(sorts).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {variants &&
        Object.entries(variants).map(([key, options]) => {

          const variant = key as keyof typeof variants;

          if (options.length < 2) return null;

          return (
            <fieldset key={key}>
              <legend>{labels[variant]}</legend>
              <div className="hito-filter-chips">
                {options.map((option) => {

                  const selected =
                    variant === 'colors'
                      ? draft.colors.includes(option)
                      : draft[variant] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {

                        if (variant === 'colors') toggle(variant, option);
                        else replace(variant, selected ? '' : option);
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      <button className="btn" type="submit">
        Aplicar filtro
      </button>
    </form>
  );
}
