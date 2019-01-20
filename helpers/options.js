const options = {
  categoryOptions: {
    code: 'Code',
    design: 'Design',
    writing: 'Writing',
    engineering: 'Engineering',
    marketing: 'Marketing',
    sales: 'Sales',
    'customer-service': 'Customer Service',
    other: 'Other'
  },

  timezoneOptions: {
    anywhere: 'Anywhere',
    americas: 'North/South America',
    'eu-africa-mideast': 'EU, Africa, Mid East',
    'central-asia': 'Central Asia',
    'east-asia-pacific': 'East Asia/Pacific'
  },

  workTypeOptions: {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    contract: 'Contract',
    internship: 'Internship'
  },

  getCategoryName(slug) {
    if (this.categoryOptions.hasOwnProperty(slug)) {
      return this.categoryOptions[slug];
    }

    return '';
  },

  getTimezoneName(slug) {
    if (this.timezoneOptions.hasOwnProperty(slug)) {
      return this.timezoneOptions[slug];
    }

    return '';
  },

  getCategoryUrl(slug) {
    return '/category/' + slug;
  },

  getTimezoneUrl(slug) {
    return '/timezone/' + slug;
  }
};

export default options;
