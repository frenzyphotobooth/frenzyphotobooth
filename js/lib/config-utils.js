(function () {
  function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function isValidSourceItem(item) {
    return Boolean(item && isNonEmptyString(item.src));
  }

  function hasValidSources(config) {
    return Boolean(
      config &&
      Array.isArray(config.sources) &&
      config.sources.length > 0 &&
      config.sources.every(isValidSourceItem)
    );
  }

  function hasValidYouTubeId(config) {
    return Boolean(config && isNonEmptyString(config.youtubeId));
  }

  function isValidFieldMap(fields, requiredKeys) {
    if (!fields || typeof fields !== 'object') return false;
    if (!Array.isArray(requiredKeys) || !requiredKeys.length) return false;
    return requiredKeys.every((key) => isNonEmptyString(fields[key]));
  }

  window.FrenzyConfigUtils = {
    isNonEmptyString,
    isValidSourceItem,
    hasValidSources,
    hasValidYouTubeId,
    isValidFieldMap,
  };
})();
