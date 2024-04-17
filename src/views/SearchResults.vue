<template>
  <div>
    <h1>Search Results</h1>
    <div>
      <ul v-if="results.length > 0">
        <li v-for="result in results" :key="result.id">{{ result.title }}</li>
      </ul>
      <p v-else>검색 결과가 없습니다.</p>
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