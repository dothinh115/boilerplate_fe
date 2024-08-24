import { ofetch } from "ofetch";

declare module "#app" {
  interface NuxtApp {
    $apiFetch: $Fetch;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $apiFetch: $Fetch;
  }
}
