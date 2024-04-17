<template>
  <div>
    <h1>Search Results</h1>
    <div>
      <ul>
        <li v-for="result in results" :key="result.id">{{ result.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {useSearchStore} from "@/stores/searchStore";
import {computed} from "vue";

export default {
  setup() {
    const searchStore = useSearchStore();
    const results = computed(() => searchStore.results);

    return {
      results: results
    }
  }
}
</script>

<style>

</style>