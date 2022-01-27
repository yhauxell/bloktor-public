<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="col of cols" :key="col.name"
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  :class="col.cssClasses"
                >
                  <template v-if="col.label !== false">
                    {{col.label || col.name}}
                  </template>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(row, rindex) of rows" :key="rindex">
                <td v-for="(col, cindex) of cols" :key="cindex" class="p-2 whitespace-nowrap text-left" :class="col.cssClasses">
                  <slot :name="`cell-${col.name}`" :data="row">
                    <div class="flex items-center">{{row[col.name]}}</div>
                  </slot>
                  <!-- <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        class="h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
                        alt=""
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        Jane Cooper
                      </div>
                      <div class="text-sm text-gray-500">
                        jane.cooper@example.com
                      </div>
                    </div>
                  </div> -->
                </td>
              </tr>

              <!-- More items... -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    cols:{
      type: Array,
      default:()=>[]
    },
    rows:{
      type: Array,
      default:()=> []
    },
  }
};
</script>

<style>
</style>