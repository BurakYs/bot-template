function disableAll(actionRow, setAsSecondary = false) {
	const newRow = JSON.parse(JSON.stringify(actionRow));

	newRow.components.forEach(x => {
		x.disabled = true;
		if (setAsSecondary && x.type === 2) x.style = 2;
	});

	return newRow;
}

module.exports = disableAll;