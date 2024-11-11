import { nextTick, ref, unref, watch } from "vue";
import { isEmpty } from "lodash-es";
import SchemaForm from "../schema-form.vue";
import type { FunctionalComponent, Ref } from "vue";
import type { SchemaFormProps } from "../schema-form";

type SchemaFormInstance = InstanceType<typeof SchemaForm>;

export const useForm = (props?: Partial<SchemaFormProps>) => {
  const formRef = ref<SchemaFormInstance>({} as SchemaFormInstance);

  // Arrow function to get the form instance after the next DOM update
  const getFormInstance = async () => {
    await nextTick();
    const form = unref(formRef);
    if (isEmpty(form)) {
      console.error("Form instance not retrieved!");
    }
    return form;
  };

  // Watch for changes in props, and update the form instance when necessary
  watch(
    () => props,
    async () => {
      if (props) {
        await nextTick();
        const formInstance = await getFormInstance();
        formInstance.setSchemaFormProps?.(props);
      }
    },
    {
      immediate: true,
      deep: true,
      flush: "post",
    },
  );

  // Proxy to access methods of the form instance dynamically
  const methods = new Proxy<Ref<SchemaFormInstance>>(formRef, {
    get: (target, key: string) => {
      if (Reflect.has(target, key)) {
        return unref(target);
      }
      if (target.value && Reflect.has(target.value, key)) {
        return Reflect.get(target.value, key);
      }
      return async (...rest) => {
        const form = await getFormInstance();
        return form?.[key]?.(...rest);
      };
    },
  });

  // Functional component to render the schema form with passed props and slots
  const SchemaFormRender: FunctionalComponent<SchemaFormProps> = (
    compProps,
    { attrs, slots },
  ) => {
    return (
      <SchemaForm
        ref={formRef}
        {...{ ...attrs, ...props, ...compProps }}
        v-slots={slots}
      ></SchemaForm>
    );
  };

  return [SchemaFormRender, unref(methods)] as const;
};
