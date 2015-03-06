core = 7.x
api = 2

libraries[nvd3][type] = libraries
libraries[nvd3][download][type] = git
libraries[nvd3][download][url] = "https://github.com/novus/nvd3.git"
libraries[nvd3][download][revision] = "7ebd54ca09061022a248bec9a050a4dec93e2b28"

libraries[d3][type] = libraries
libraries[d3][download][type] = git
libraries[d3][download][url] = "https://github.com/mbostock/d3.git"
libraries[d3][download][revision] = "f82dd6fb414a15bca4f9c39c7c9442295ddea416"

libraries[csv][type] = libraries
libraries[csv][download][type] = git
libraries[csv][download][url] = "https://github.com/okfn/csv.js.git"
libraries[csv][download][revision] = "976b61384a1808eb464aca5876e5ea46c98deaee"

libraries[lodash][type] = libraries
libraries[lodash][download][type] = git
libraries[lodash][download][url] = "https://github.com/lodash/lodash.git"
libraries[lodash][download][revision] = "e21e993729861a2bc1d01c858cfabce7a27d2861"

libraries[backbone][type] = libraries
libraries[backbone][download][type] = git
libraries[backbone][download][url] = "https://github.com/jashkenas/backbone.git"
libraries[backbone][download][revision] = "e109f6d3e7a366f933f1f34405ca97effecae6c5"

libraries[lodash_data][type] = libraries
libraries[lodash_data][download][type] = git
libraries[lodash_data][download][url] = "https://github.com/NuCivic/lodash.data.git"
libraries[lodash_data][download][revision] = "0dbe0701003b8a45037ab5fada630db2dbf75d9d"

libraries[reclineViewNvd3][type] = libraries
libraries[reclineViewNvd3][download][type] = git
libraries[reclineViewNvd3][download][url] = "https://github.com/NuCivic/recline.view.nvd3.js.git"
libraries[reclineViewNvd3][download][branch] = new_ui
libraries[reclineViewNvd3][download][revision] = "b6b76da2bb106da843e38d35b2835527aadd7669"

libraries[slickgrid][type] = libraries
libraries[slickgrid][download][type] = git
libraries[slickgrid][download][url] = "https://github.com/mleibman/SlickGrid.git"
libraries[slickgrid][download][revision] = "e004912b5ce29ac0d0cb04df50fe66db5e3af9ea"

libraries[mustache][type] = libraries
libraries[mustache][download][type] = git
libraries[mustache][download][url] = "https://github.com/janl/mustache.js.git"
libraries[mustache][download][revision] = "d4ba5a19d4d04b139bbf7840fe342bb43930aee3"

libraries[moment][type] = libraries
libraries[moment][download][type] = git
libraries[moment][download][url] = "https://github.com/moment/moment.git"
libraries[moment][download][revision] = "78a53b8cb53e967c6dac2e7325e18da2a472fc2d"

libraries[chosen][type] = libraries
libraries[chosen][download][type] = get
libraries[chosen][download][url] = https://github.com/harvesthq/chosen/releases/download/v1.3.0/chosen_v1.3.0.zip
libraries[chosen][destination] = libraries

libraries[chosen_bootstrap][type] = libraries
libraries[chosen_bootstrap][download][type] = git
libraries[chosen_bootstrap][download][url] = https://github.com/dbtek/chosen-bootstrap.git
libraries[chosen_bootstrap][destination] = libraries

libraries[recline][type] = libraries
libraries[recline][download][type] = git
libraries[recline][download][url] = "https://github.com/okfn/recline.git"
libraries[recline][download][revision] = "5b28edf072f7c06b8ea213a4048d97abc0424300"