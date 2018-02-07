define([
	'fontoxml-families/configureAsFrame',
	'fontoxml-families/configureAsSheetFrame',
	'fontoxml-families/configureAsStructure',
	'fontoxml-families/configureAsTitleFrame',
	'fontoxml-families/configureContextualOperations',
	'fontoxml-families/createMarkupLabelWidget',
	'fontoxml-families/createRelatedNodesQueryWidget',
	'fontoxml-localization/t'
], function (
	configureAsFrame,
	configureAsSheetFrame,
	configureAsStructure,
	configureAsTitleFrame,
	configureContextualOperations,
	createMarkupLabelWidget,
	createRelatedNodesQueryWidget,
	t
) {
	'use strict';

	return function configureSxModule (sxModule) {
		// learningAssessment
		//     A Learning Assessment presents questions or interactions that measure progress, encourage
		//     recollection, and stimulate reinforcement of the learning content, and can be presented before the
		//     content as a pre-assessment or as a post-assessment test. The interactions use a sub-set of the
		//     Question-Test Interoperability (QTI) specification, implemented as a DITA domain specialization.
		configureAsSheetFrame(sxModule, 'self::learningAssessment', t('learning assessment'), {
			defaultTextContainer: 'learningAssessmentbody',
			titleQuery: './title//text()[not(ancestor::*[name() = ("sort-at", "draft-comment", "foreign", "unknown", "required-cleanup", "image")])]/string() => string-join()',
			blockFooter: [
				createRelatedNodesQueryWidget('./related-links'),
				createRelatedNodesQueryWidget('descendant::fn[not(@conref) and fonto:in-inline-layout(.)]')
			],
			blockHeaderLeft: [
				createMarkupLabelWidget()
			]
		});

		// learningAssessment nested in topic
		configureAsFrame(sxModule, 'self::learningAssessment and ancestor::*[fonto:dita-class(., "topic/topic")]', undefined, {
			defaultTextContainer: 'learningAssessmentbody',
			blockFooter: [
				createRelatedNodesQueryWidget('./related-links]')
			],
			blockHeaderLeft: [
				createMarkupLabelWidget()
			]
		});

		// title in learningAssessment
		configureAsTitleFrame(sxModule, 'self::title[parent::learningAssessment]', undefined, {
			fontVariation: 'document-title'
		});

		// learningAssessmentbody
		//     The <learningAssessmentbody> element is the main body-level element in a learningAssessment topic.
		configureAsStructure(sxModule, 'self::learningAssessmentbody', t('body'), {
			defaultTextContainer: 'section',
			ignoredForNavigationNextToSelector: 'false()',
			isRemovableIfEmpty: false
		});

		// section in learningAssessmentbody
		configureContextualOperations(sxModule, 'self::section[parent::learningAssessmentbody]', [
			{ name: ':section-insert-title' },
			{ name: ':contextual-delete-section' }
		]);
	};
});
