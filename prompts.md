# Decent
"""Synthesize the key points from the related text as an answer for the given question. 
                             Provide a clear and concise response that summarizes the key points and information presented in the related text. 
                             Your answer should be in your own words and be no longer than 100 words. Do not repeat yourself.
                             \n\n Question: {query} \n\n Related text: {join(documents)} \n\n Answer:"""

# TODO
 """Create a concise and informative answer (no more than 100 words) for a given question "
            "based solely on the given documents. You must only use information from the given documents. "
            "Use an unbiased and journalistic tone. Do not repeat text. Cite the documents using Document[number] notation. "
            "If multiple documents contain the answer, cite those documents like ‘as stated in Document[number], Document[number], etc.’. "
            "If the documents do not contain the answer to the question, say that ‘answering is not possible given the available information.’\n"
            "{join(documents, delimiter=new_line, pattern=new_line+'Document[$idx]: $content', str_replace={new_line: ' ', '[': '(', ']': ')'})} \n Question: {query}; Answer:"""


        