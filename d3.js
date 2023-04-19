var data = d3.range(100).map(function () {
	return {
		x: Math.random() * 480 + 10,
		y: Math.random() * 480 + 10,
	}
})

var xScale = d3.scaleLinear().domain([0, 500]).range([0, 500])
var yScale = d3.scaleLinear().domain([0, 500]).range([500, 0])

var svg = d3.select(".chart").attr("width", 500).attr("height", 500)

var circles = svg
	.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function (d) {
		return xScale(d.x)
	})
	.attr("cy", function (d) {
		return yScale(d.y)
	})
	.attr("r", 5)
	.attr("fill", "steelblue")

d3.csv("titanic.csv").then(function (data) {
	data.forEach(function (d) {
		d.Age = +d.Age
	})

	var ageData = []

	data.forEach(function (d) {
		if (d.Age) {
			var ageGroup = Math.floor(d.Age / 10) * 10 + "-" + (Math.floor(d.Age / 10) * 10 + 9)
			if (!ageData[ageGroup]) {
				ageData[ageGroup] = 0
			}
			ageData[ageGroup]++
		}
	})

	var ageDataArray = Object.keys(ageData).map(function (key) {
		return { ageGroup: key, count: ageData[key] }
	})

	var width = 800
	var height = 800
	var radius = Math.min(width, height) / 2 - 100

	var svg = d3
		.select("#chart")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

	var color = d3
		.scaleOrdinal()
		.domain(ageDataArray.map(d => d.ageGroup))
		.range(d3.schemeCategory10)

	var pie = d3.pie().value(d => d.count)

	var path = d3
		.arc()
		.outerRadius(radius - 20)
		.innerRadius(radius - radius * 0.9)

	var label = d3
		.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40)

	var arc = svg.selectAll(".arc").data(pie(ageDataArray)).enter().append("g").attr("class", "arc")

	arc
		.append("path")
		.attr("d", path)
		.attr("fill", d => color(d.data.ageGroup))

	arc
		.append("text")
		.attr("transform", function (d) {
			return "translate (" + label.centroid(d).map(num => num * 1.4) + ")"
		})
		.text(d => d.data.ageGroup)
})
