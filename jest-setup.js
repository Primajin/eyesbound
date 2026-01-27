/* eslint-disable import-x/no-unassigned-import, no-undef */
import '@testing-library/jest-dom';
import {createSerializer} from '@emotion/jest';

// Add emotion serializer for proper CSS snapshots
// Use classNameReplacer to show actual CSS class names
expect.addSnapshotSerializer(createSerializer({
	classNameReplacer(className, index) {
		return `emotion-${index}`;
	},
}));
