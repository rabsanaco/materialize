<template>
  <div class="text-center">
    <v-badge left>
      <template v-slot:badge>
        <span>2</span>
      </template>
      <span>Examples</span>
    </v-badge>

    &nbsp;&nbsp;

    <v-badge color="green">
      <template v-slot:badge>
        <v-icon dark>mdi-format-list-bulleted-square</v-icon>
      </template>
      <span>Lists</span>
    </v-badge>
  </div>
</template>
