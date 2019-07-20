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
    if (this.categoryOptions[slug]) {
      return this.categoryOptions[slug];
    }

    return '';
  },

  getTimezoneName(slug) {
    return this.timezoneOptions[slug] ? this.timezoneOptions[slug] : '';
  },

  getWorkTypeName(slug) {
    return this.workTypeOptions[slug] ? this.workTypeOptions[slug] : '';
  },

  getCategoryUrl(slug) {
    return '/category/' + slug;
  },

  getTimezoneUrl(slug) {
    return '/timezone/' + slug;
  }
};

export default options;
