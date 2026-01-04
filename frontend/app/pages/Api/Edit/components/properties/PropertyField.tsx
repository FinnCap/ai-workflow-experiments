import { Plus } from 'lucide-react';
import type { NestedApiProperty } from '../../../common/nested-api-property';
import LineObject from './LineObject';
import PropertyRow from './PropertyRow';

interface PropertyFieldProps {
  props: NestedApiProperty[];
  basePath?: number[];
  level?: number;
  onUpdateProperty: (path: number[], field: keyof NestedApiProperty, value: string | boolean) => void;
  onRemoveProperty: (path: number[]) => void;
  onAddProperty: (parentPath?: number[]) => void;
  isGetRequest: boolean;
}

export default function PropertyField({
  props,
  basePath = [],
  level = 0,
  onUpdateProperty,
  onRemoveProperty,
  onAddProperty,
  isGetRequest = false
}: PropertyFieldProps) {
  return (
    <div className="space-y-1">
      {props.map((property, index) => {
        const currentPath = [...basePath, index];
        const isObject = property.type === 'object';

        return (
          <div key={index}>
            {/* Main property row */}
            <div className={`group relative ${level > 0 ? 'ml-8' : ''}`}>
              {/* Connecting lines for nested properties */}
              {level > 0 && (
                <LineObject />
              )}
              <PropertyRow
                property={property}
                currentPath={currentPath}
                isGetRequest={isGetRequest}
                onUpdateProperty={onUpdateProperty}
                onRemoveProperty={onRemoveProperty}
              />
            </div>

            {/* Nested properties for object types */}
            {isObject && (
              <div className="mt-1">
                {property.properties && property.properties.length > 0 ? (
                  <PropertyField
                    props={property.properties}
                    basePath={currentPath}
                    level={level + 1}
                    onUpdateProperty={onUpdateProperty}
                    onRemoveProperty={onRemoveProperty}
                    onAddProperty={onAddProperty}
                    isGetRequest={isGetRequest}
                  />
                ) : (
                  <div></div>
                )}

                {/* Add property button for objects */}
                <div className={`${level > 0 ? 'ml-8' : ''} ml-8 relative mt-2`}>
                  <LineObject halfHeight={true} />
                  <button
                    type="button"
                    onClick={() => onAddProperty(currentPath)}
                    className="flex items-center ml-2 space-x-1 text-sm text-gray-600 hover:text-gray-800 py-1 px-2 bg-gray-50 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add property to {property.name}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}